import React, { useState, useContext } from "react"
import { Mutation } from 'react-apollo'
import { gql } from 'apollo-boost'
import axios from 'axios'
import moment from 'moment'

import withStyles from "@material-ui/core/styles/withStyles"
import IconButton from "@material-ui/core/IconButton"
import EditIcon from "@material-ui/icons/Edit"
import Button from "@material-ui/core/Button"
import TextField from "@material-ui/core/TextField"
import Dialog from "@material-ui/core/Dialog"
import DialogActions from "@material-ui/core/DialogActions"
import DialogContent from "@material-ui/core/DialogContent"
import DialogContentText from "@material-ui/core/DialogContentText"
import FormControl from "@material-ui/core/FormControl"
import FormHelperText from "@material-ui/core/FormHelperText"
import DialogTitle from "@material-ui/core/DialogTitle"
import CircularProgress from "@material-ui/core/CircularProgress"
import LibraryMusicIcon from "@material-ui/icons/LibraryMusic"

import Error from '../Shared/Error'
import { GET_SHOWS_QUERY } from '../../pages/App'
import { UserContext } from '../../Root'

const UpdateShow = ({ classes, show }) => {
  const currentUser = useContext(UserContext)
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState(show.title)
  const [description, setDescription] = useState(show.description)
  const [url, setUrl] = useState(show.url)
  const [duration, setDuration] = useState(show.duration)
  const [startTime, setStartTime] = useState(moment(show.startTime).format('YYYY-MM-DDThh:mm'))

  const [submitting, setSubmitting] = useState(false)
  const isCurrentUser = currentUser.id === show.postedBy.id

  const handleSubmit = async (event, updateShow) => {
    event.preventDefault()
    setSubmitting(true)
    updateShow({ variables: { showId: show.id, title, description, url, duration, startTime }})
  }

  return (
    isCurrentUser && (
    <>
      <IconButton onClick={() => setOpen(true)} >
        <EditIcon />
      </IconButton>

      <Mutation
        mutation={UPDATE_SHOW_MUTATION}
        onCompleted={data => {
          setSubmitting(false)
          setOpen(false)
        }}
      >
        {(updateShow, { loading, error }) => {
          if (error) return <Error error={error} />
          return (
            <Dialog open={open} className={classes.dialog}>
              <form onSubmit={event => handleSubmit(event, updateShow)}>
          <DialogTitle>Update Show {}</DialogTitle>
                <DialogContent>
                  <DialogContentText>
                    Update the Title, Description, URL, Start Time, and/or Duration.
                  </DialogContentText>
                  <FormControl fullWidth>
                    <TextField
                      label='Title'
                      placeholder='Add Title'
                      onChange={event => setTitle(event.target.value)}
                      value={title}
                      className={classes.textField}
                    />
                  </FormControl>
                  <FormControl fullWidth>
                    <TextField
                      label='Url'
                      placeholder='Add Url'
                      onChange={event => setUrl(event.target.value)}
                      value={url}
                      className={classes.textField}
                    />
                  </FormControl>
                  <TextField
                    label="Start Time"
                    type="datetime-local"
                    onChange={event => setStartTime(event.target.value)}
                    value={startTime}
                    className={classes.textField}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                  <FormControl fullWidth>
                    <TextField
                      type="number"
                      label='Duration'
                      InputProps={{
                        inputProps: { 
                            max: 1439, min: 1 
                        }
                    }}
                      placeholder='60'
                      onChange={event => setDuration(event.target.value)}
                      value={duration}
                      className={classes.textField}
                    />
                  </FormControl>
                  <FormControl fullWidth>
                    <TextField
                      multiline
                      rows='3'
                      label='Description'
                      placeholder='Add Description'
                      onChange={event => setDescription(event.target.value)}
                      value={description}
                      className={classes.textField}
                    />
                  </FormControl>
                </DialogContent>
                <DialogActions>
                  <Button
                    disabled={submitting}
                    onClick={() => setOpen(false)}
                    className={classes.cancel}
                  >
                    Cancel
                  </Button>
                  <Button
                    disabled={
                      submitting || !title.trim() || !description.trim() || !url.trim() || !duration || !startTime.trim()
                    }
                    type='submit'
                    className={classes.save}
                  >
                    {submitting ? (
                      <CircularProgress className={classes.save} 
                        size={24}
                      />
                    ) : (
                      'Update Show'
                    )}
                  </Button>
                </DialogActions>
              </form>
            </Dialog>
          )
        }}
      </Mutation>
    </>
  )
  )
}

const UPDATE_SHOW_MUTATION = gql`
  mutation($showId: Int!, $title: String, $url: String, $description: String, $duration: String, $startTime: DateTime) {
    updateShow (
      showId: $showId,
      title: $title,
      url: $url,
      description: $description
      duration: $duration
      startTime: $startTime
    ) {
      show {
        id
        title
        description
        url
        startTime
        duration
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
    display: "flex",
    flexWrap: "wrap"
  },
  dialog: {
    margin: "0 auto",
    maxWidth: 550
  },
  textField: {
    margin: theme.spacing.unit
  },
  cancel: {
    color: "red"
  },
  save: {
    color: "green"
  },
  button: {
    margin: theme.spacing.unit * 2
  },
  icon: {
    marginLeft: theme.spacing.unit
  },
  input: {
    display: "none"
  }
})

export default withStyles(styles)(UpdateShow)