package services

import (
	"encoding/json"
	"fmt"
	"net/http"
	"net/url"
	"os"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
	"jespersen.zip.assetory/internal/dto"
	"jespersen.zip.assetory/internal/env"
	"jespersen.zip.assetory/internal/model"
	"jespersen.zip.assetory/internal/util"
)

type AuthService struct {
	Config *env.Config
	DB     *gorm.DB
}

func NewAuthService(db *gorm.DB, config *env.Config) *AuthService {
	return &AuthService{
		Config: config,
		DB:     db,
	}
}

func (e *AuthService) Register(ctx *gin.Context, username string, password string) {
	var user model.User
	tokenUUID := uuid.New()
	e.DB.Where("user_name = ?", username).First(&user)
	if len(user.UserName) == 0 && len(username) != 0 {
		hash, _ := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)

		user.IsOidc = false
		user.UserName = username
		user.Password = string(hash)

		e.DB.Create(&user)
		e.DB.Create(&model.APIAccess{
			User:        &user,
			Permissions: []string{"settings:user"},
			Token:       tokenUUID.String(),
		})

		util.GenerateAuthRedirect(
			ctx,
			tokenUUID.String(),
			false,
		)
		return
	} else {
		util.GenerateAuthRedirect(
			ctx,
			"Username already taken! Choose an other one.",
			true,
		)
		return
	}
}

func (e *AuthService) Login(ctx *gin.Context, username string, password string) {
	var user model.User
	e.DB.Where("user_name = ?", username).First(&user)
	if len(user.UserName) != 0 && len(username) != 0 && user.IsOidc == false {
		err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(password))
		if err != nil {
			fmt.Println(err)
			util.GenerateAuthRedirect(
				ctx,
				"Invalid password.",
				true,
			)
			return
		}

		tokenUUID := uuid.New()
		var apiAccess model.APIAccess
		e.DB.Where("user_id = ?", user.ID).First(&apiAccess)

		apiAccess.Token = tokenUUID.String()
		e.DB.Updates(&apiAccess)
		util.GenerateAuthRedirect(
			ctx,
			tokenUUID.String(),
			false,
		)
		return
	} else {
		util.GenerateAuthRedirect(
			ctx,
			"No User found!",
			true,
		)
		return
	}
}

func (e *AuthService) Oidc(ctx *gin.Context, code string) {
	clientId := os.Getenv("OIDC_CLIENT_ID")
	clientSecret := os.Getenv("OIDC_CLIENT_SECRET")
	redirectUrl := os.Getenv("OIDC_REDIRECT_URL")
	issuer := e.GetOidcIssuerData()

	urlData := url.Values{}
	urlData.Add("code", code)
	urlData.Add("client_id", clientId)
	urlData.Add("client_secret", clientSecret)
	urlData.Add("redirect_uri", redirectUrl)
	urlData.Add("grant_type", "authorization_code")

	client := &http.Client{}
	r, err := http.NewRequest("POST", issuer.TokenEndpoint, strings.NewReader(urlData.Encode()))
	r.Header.Add("Content-Type", "application/x-www-form-urlencoded")

	res, err := client.Do(r)

	if err != nil {
		fmt.Println(err)
		return
	}
	defer res.Body.Close()

	var tokenData dto.OidcTokenDto
	json.NewDecoder(res.Body).Decode(&tokenData)

	client = &http.Client{}
	r, err = http.NewRequest("GET", issuer.UserinfoEndpoint, nil)
	r.Header.Add("Authorization", "Bearer "+tokenData.AccessToken)
	userCheck, err := client.Do(r)
	if err != nil {
		fmt.Println(err)
		return
	}
	defer userCheck.Body.Close()

	var userInfo dto.OidcUserDto
	json.NewDecoder(userCheck.Body).Decode(&userInfo)

	var user model.User
	tokenUUID := uuid.New()
	e.DB.Where("user_name = ?", userInfo.PreferredUsername).First(&user)
	if len(user.UserName) == 0 && len(userInfo.PreferredUsername) != 0 {
		user.AccessToken = tokenData.AccessToken
		user.IsOidc = true
		user.UserName = userInfo.PreferredUsername

		e.DB.Create(&user)
		e.DB.Create(&model.APIAccess{
			User:        &user,
			Permissions: []string{"oidc", "settings:user"},
			Token:       tokenUUID.String(),
		})

		util.GenerateAuthRedirect(
			ctx,
			tokenUUID.String(),
			false,
		)
		return
	} else {
		var apiAccess model.APIAccess
		e.DB.Where("user_id = ?", user.ID).First(&apiAccess)
		if len(apiAccess.Token) == 0 {
			util.GenerateAuthRedirect(
				ctx,
				"Failed to fetch user from OIDC Provider",
				true,
			)
			return
		}

		apiAccess.Token = tokenUUID.String()
		e.DB.Updates(&apiAccess)
		util.GenerateAuthRedirect(
			ctx,
			tokenUUID.String(),
			false,
		)
		return
	}
}

func (e *AuthService) GenerateOidcAuthorizationUrl() string {
	clientId := os.Getenv("OIDC_CLIENT_ID")
	if len(clientId) == 0 {
		return ""
	}
	redirectUrl := os.Getenv("OIDC_REDIRECT_URL")
	issuer := e.GetOidcIssuerData()
	return issuer.AuthorizationEndpoint + "?client_id=" + clientId + "&redirect_uri=" + redirectUrl + "&response_type=code&scope=profile+openid"
}

func (e *AuthService) GetOidcIssuerData() dto.OidcIssuerDto {
	if len(os.Getenv("OIDC_ISSUER_URL")) == 0 {
		fmt.Println("Missing Issuer Url for OIDC")
	}
	url := os.Getenv("OIDC_ISSUER_URL")
	res, err := http.Get(url)
	if err != nil {
		println("Failed to get ISSUER Provider Endpoint")
	}
	defer res.Body.Close()
	var data dto.OidcIssuerDto
	json.NewDecoder(res.Body).Decode(&data)

	return data
}
