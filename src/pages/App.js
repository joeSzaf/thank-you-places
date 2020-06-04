import React, {useState} from "react"
import { Query } from 'react-apollo'
import { gql } from 'apollo-boost'
import withStyles from "@material-ui/core/styles/withStyles"
import Loading from '../components/Shared/Loading'
import Error from '../components/Shared/Error'

import SearchShows from '../components/Show/SearchShows'
import ShowList from '../components/Show/ShowList'
import CreateShow from '../components/Show/CreateShow'

const App = ({ classes }) => {
  const [searchResults, setSearchResults] = useState([])

  return (                
    <div className={classes.container}>
      <CreateShow />
      <Query query={GET_SHOWS_QUERY}>
        {({ data, loading, error }) => {
          if (loading) return <Loading />
          if (error) return <Error error={error} />
          // const shows = data.me.showSet
          const shows = searchResults.length > 0 ? searchResults : data.me.showSet
          return (
            <>
              <SearchShows setSearchResults={setSearchResults} currentUser={data.me} />
              <ShowList shows={shows} />
            </>
          )
        }}
      </Query>
    </div>           
  )
}

export const GET_SHOWS_QUERY = gql`
  {
    me {
      id
      username
      firstName
      showSet {
        id
        title
        description
        url
        duration
        startTime
        postedBy {
          id
          username
        }
      }
    }
  }
`

const styles = theme => ({
  container: {
    margin: "0 auto",
    maxWidth: 960,
    padding: theme.spacing.unit * 2
  }
})

export default withStyles(styles)(App)
