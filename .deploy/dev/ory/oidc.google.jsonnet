
local claims = {
  email_verified: true
} + std.extVar('claims');

{
  identity: {
    traits: {
      [if "email" in claims && claims.email_verified then "email" else null]: claims.email,
      // additional claims
      // please also see the `Google specific claims` section
      firstName: claims.given_name,
      lastName: claims.family_name,
      picture: claims.picture,
      username: std.md5(claims.email),
      [if "hd" in claims && claims.email_verified then "hd" else null]: claims.hd,
    },
  },
}
