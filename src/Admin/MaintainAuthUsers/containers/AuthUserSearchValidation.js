const validateSearch = (user, setError) => {
  if (!user || !user.trim()) {
    setError([{ targetName: 'user', text: 'Enter a username or email address' }])
    return false
  }
  if (!user.includes('@') && !/^[a-zA-Z0-9_]*$/.test(user.trim())) {
    setError([{ targetName: 'user', text: 'Username can only include letters, numbers and _' }])
    return false
  }
  return true
}

export default validateSearch
