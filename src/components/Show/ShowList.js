import React from "react"
import withStyles from "@material-ui/core/styles/withStyles"
import List from "@material-ui/core/List"
import ListItem from "@material-ui/core/ListItem"
import ListItemText from "@material-ui/core/ListItemText"
import Typography from "@material-ui/core/Typography"
import ExpansionPanel from "@material-ui/core/ExpansionPanel"
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails"
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary"
import ExpansionPanelActions from "@material-ui/core/ExpansionPanelActions"
import ExpandMoreIcon from "@material-ui/icons/ExpandMore"
import { Link } from 'react-router-dom'

import UpdateShow from './UpdateShow'
import DeleteShow from './DeleteShow'

const ShowList = ({ classes, shows }) => (
  <List>
    {shows.map(show => (
      <ExpansionPanel key={show.id}>
        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
          <ListItem className={classes.root}>
            <ListItemText 
              primaryTypographyProps={{
                variant: 'subheading',
                color: 'primary'
              }}
              primary={show.title}
              secondary={
                <Link to={`/profile/${show.postedBy.id}`} className={classes.link} >
                  {show.postedBy.username}
                </Link>
              }
            />
          </ListItem>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails className={classes.details}>
            <Typography variant='body1'>
              {show.description}
            </Typography>
        </ExpansionPanelDetails>
        <ExpansionPanelActions>
          <DeleteShow show={show} />
          <UpdateShow show={show} />
        </ExpansionPanelActions>
      </ExpansionPanel>
    ))}
  </List>
)

const styles = {
  root: {
    display: "flex",
    flexWrap: "wrap"
  },
  details: {
    alignItems: "center"
  },
  link: {
    color: "#424242",
    textDecoration: "none",
    "&:hover": {
      color: "black"
    }
  }
}

export default withStyles(styles)(ShowList)
