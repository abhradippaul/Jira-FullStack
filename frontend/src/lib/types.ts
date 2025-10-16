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
  invite_code: string;
}

export interface GetSingleWorkspaceForInvite {
  workspace:
    | {
        name: string;
        image_url: string | null | undefined;
      }
    | null
    | undefined;
  alreadyMember: boolean | null | undefined;
}

export interface GetWorkspaceMembers {
  workspaceMembers:
    | {
        id: string;
        name: string;
        role: string;
        email: string;
      }[]
    | null
    | undefined;
  msg: string;
}

export interface GetProjects {
  projects:
    | {
        id: string;
        name: string;
        image_url: string | null | undefined;
      }[]
    | null
    | undefined;
  msg: string;
}

export interface GetProject {
  project:
    | {
        id: string;
        name: string;
        image_url: string | null | undefined;
      }
    | null
    | undefined;
  msg: string;
}

export interface GetSingleProject {
  id: string;
  workspace_id: string;
  name: string;
  image_key: string | null | undefined;
  image_url: string | null | undefined;
}

export const TaskStatus = {
  BACKLOG: "BACKLOG",
  TODO: "TODO",
  IN_PROGRESS: "IN_PROGRESS",
  IN_REVIEW: "IN_REVIEW",
  DONE: "DONE",
} as const;

export type TaskStatus = (typeof TaskStatus)[keyof typeof TaskStatus];
