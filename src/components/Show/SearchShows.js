import React, { useState, useRef } from "react"
import { ApolloConsumer } from 'react-apollo'
import { gql } from 'apollo-boost'

import withStyles from "@material-ui/core/styles/withStyles"
import TextField from "@material-ui/core/TextField"
import ClearIcon from "@material-ui/icons/Clear"
import Paper from "@material-ui/core/Paper"
import IconButton from "@material-ui/core/IconButton"
import SearchIcon from "@material-ui/icons/Search"

const SearchShows = ({ classes, setSearchResults, currentUser }) => {
  const [search, setSearch] = useState('')
  const inputEl = useRef()

  const clearSearchInput = () => {
    setSearchResults([])
    setSearch('')
    inputEl.current.focus()
  }
  
  const handleSubmit = async (event, client) => {
    event.preventDefault()
    const res = await client.query({
      query: SEARCH_SHOWS_QUERY,
      variables: { search, userId: currentUser.id }
    })
    setSearchResults(res.data.shows)
  }


  return (
    <ApolloConsumer>
      {client => (
        <form onSubmit={event => handleSubmit(event, client)}>
          <Paper className={classes.root} elevation={1}>
            <IconButton>
              <ClearIcon onClick={clearSearchInput} />
            </IconButton>
            <TextField
              fullWidth
              placeholder='Search All Shows'
              InputProps={{
                disableUnderline: true
              }}
              onChange={event => setSearch(event.target.value)}
              value={search}
              inputRef={inputEl}
            />
            <IconButton type='submit'>
              <SearchIcon />
            </IconButton>
          </Paper>
        </form>
      )}
    </ApolloConsumer>
  )
}

const SEARCH_SHOWS_QUERY = gql`
  query($search: String, $userId: String) {
    shows(search: $search, userId: $userId) {
      id
      title
      description
      url
      postedBy {
        id
        username
      }
    }
  }
`

const styles = theme => ({
  root: {
    padding: "2px 4px",
    margin: theme.spacing.unit,
    display: "flex",
    alignItems: "center"
  }
})

export default withStyles(styles)(SearchShows)
