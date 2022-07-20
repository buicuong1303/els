function(ctx) {
  identity: {
    id: ctx.identity.id,
    [if "inviter" in ctx.identity.traits then "inviter" else null]: ctx.identity.traits.inviter
  }
}
