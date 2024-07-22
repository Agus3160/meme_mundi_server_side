
export default () => {
  return {
    accessTokenSecret: process.env.ACCESS_TOKEN_SECRET,
    refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET,
    accessTokenExpiresIn: parseInt(process.env.ACCESS_TOKEN_EXPIRES_IN || '3600000'),
    refreshTokenExpiresIn: parseInt(process.env.REFRESH_TOKEN_EXPIRES_IN || '86400000')
  }
}