import React from "react"
import { createBrowserHistory } from 'history'
import { ApolloConsumer } from 'react-apollo'
import withStyles from "@material-ui/core/styles/withStyles"
import ExitToApp from "@material-ui/icons/ExitToApp"
import Typography from "@material-ui/core/Typography"
import Button from "@material-ui/core/Button"

const history = createBrowserHistory()

const handleSignout = client => {
  localStorage.removeItem('authToken')
  client.writeData({ data: { isLoggedIn: false } })
  history.push('/')
}

const Signout = ({ classes }) => {
  return (
    <ApolloConsumer >
      {client => (
        <Button onClick={() => handleSignout(client)}>
          <Typography
            variant='body1'
            className={classes.buttonText}
          >
            Signout
          </Typography>
          <ExitToApp className={classes.buttonIcon} color='secondary' />
        </Button>
      )}
    </ApolloConsumer>
  )
}

const styles = {
  buttonText: {
    color: 'white'
  },
  buttonIcon: {
    marginLeft: "5px",
    color: 'white'
  }
}

export default withStyles(styles)(Signout)
