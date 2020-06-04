import React from "react"
import { Query } from 'react-apollo'
import { gql } from 'apollo-boost'
import withStyles from "@material-ui/core/styles/withStyles"
import Card from "@material-ui/core/Card"
import CardHeader from "@material-ui/core/CardHeader"
import Avatar from "@material-ui/core/Avatar"
import Paper from "@material-ui/core/Paper"
import Typography from "@material-ui/core/Typography"
import ThumbUpIcon from "@material-ui/icons/ThumbUpTwoTone"
import LocalPlayIcon from '@material-ui/icons/LocalPlay'
import Divider from "@material-ui/core/Divider"
import format from 'date-fns/format'

import Error from '../components/Shared/Error'
import Loading from '../components/Shared/Loading'

const Profile = ({ classes, match }) => {
  const id = match.params.id

  return(
    <Query query={PROFILE_QUERY} variables={{ id }}>
      {({ data, loading, error }) => {
        if (loading) return <Loading />
        if (error) return <Error error={error} />

        return (
          <div>
            <Card className={classes.card}>
              <CardHeader
                avatar={<Avatar>{data.user.username[0]}</Avatar>}
                title={data.user.username}
                subheader={`Joined ${format(data.user.dateJoined, 'MMM Do, YYYY')}`}
              />
            </Card>

            <Paper elevation={1} className={classes.paper}>
              <Typography variant='title' className={classes.title}>
                <LocalPlayIcon className={classes.playIcon} color='primary' />
                Shows!
              </Typography>
              {data.user.showSet.map(show => (
                <div key={show.id}>
                  <Typography>
                    {show.title}
                  </Typography>
                  <Divider className={classes.divider} />
                </div>
              ))}
            </Paper>
          </div>
        )
      }}
    </Query>
  )
}

const PROFILE_QUERY = gql`
  query ($id: Int!) {
    user(id: $id) {
        id
        username
        dateJoined
        showSet {
            id
            title
            url
        }
    }
  }
`

const styles = theme => ({
  paper: {
    width: "auto",
    display: "block",
    padding: theme.spacing.unit * 2,
    marginLeft: theme.spacing.unit * 3,
    marginRight: theme.spacing.unit * 3,
    marginTop: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit * 2,
    [theme.breakpoints.up("md")]: {
      width: 650,
      marginLeft: "auto",
      marginRight: "auto"
    }
  },
  card: {
    display: "flex",
    justifyContent: "center"
  },
  title: {
    display: "flex",
    alignItems: "center",
    marginBottom: theme.spacing.unit * 2
  },
  playIcon: {
    fontSize: 30,
    marginRight: theme.spacing.unit
  },
  thumbIcon: {
    color: "green",
    marginRight: theme.spacing.unit
  },
  divider: {
    marginTop: theme.spacing.unit,
    marginBottom: theme.spacing.unit
  }
});

export default withStyles(styles)(Profile)