export type TUserResponse = {
  name: string
  email: string
  id: string
}

export type TRefreshTokenResponse = {
  success: boolean
  data: {
    user: TUserResponse
    accessToken: string
  }
}

export type TInitializeResponse = {
  success: boolean
  data: TUserResponse
}
