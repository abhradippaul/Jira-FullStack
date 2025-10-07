export interface GetCurrentUserType {
  id: string;
  name: string;
  email: string;
}

export interface GetWorkspaces {
  id: string;
  name: string;
  image_url: string | null | undefined;
}

export interface GetSingleWorkspace {
  workspace_id: string;
  name: string;
  image_key: string | null | undefined;
  image_url: string | null | undefined;
}
