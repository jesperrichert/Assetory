package env

type Config struct {
	// AllowRegister string MOVED TO DB
}

func NewConfig() *Config {
	return &Config{
		// AllowRegister: util.EnvToConfigValue("ALLOW_REGISTER", "true"),
	}
}
