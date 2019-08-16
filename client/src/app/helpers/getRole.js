import roles from './roles'

const getRole = (value, t) => roles(t).find(type => type.value === value)

export default getRole
