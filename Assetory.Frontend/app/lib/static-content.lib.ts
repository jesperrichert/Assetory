export type ContentAction = {
  key: string;
  name: string;
  action: () => void;
};

export abstract class CreateContentOptions {
  public static FOLDER: ContentAction = {
    key: "FOLDER",
    name: "Folder",
    action() {},
  };
  public static WORDPRESS: ContentAction = {
    key: "WORDPRESS",
    name: "Wordpress",
    action() {},
  };
  public static GIT: ContentAction = {
    key: "GIT",
    name: "Git",
    action() {},
  };

  public static getAction(key: string): ContentAction {
    return Object.values(CreateContentOptions).filter(
      (f: ContentAction) => f.key == key,
    )[0];
  }
}
