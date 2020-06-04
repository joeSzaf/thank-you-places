import React, { useState } from "react"
import { Mutation } from 'react-apollo'
import { gql } from 'apollo-boost'

import withStyles from "@material-ui/core/styles/withStyles"
import Dialog from "@material-ui/core/Dialog"
import DialogActions from "@material-ui/core/DialogActions"
import DialogContent from "@material-ui/core/DialogContent"
import DialogContentText from "@material-ui/core/DialogContentText"
import DialogTitle from "@material-ui/core/DialogTitle"
import FormControl from "@material-ui/core/FormControl"
import TextField from "@material-ui/core/TextField"
import Button from "@material-ui/core/Button"
import CircularProgress from "@material-ui/core/CircularProgress"
import AddIcon from "@material-ui/icons/Add"
import ClearIcon from "@material-ui/icons/Clear"

import { MuiPickersUtilsProvider, KeyboardDateTimePicker } from "@material-ui/pickers"
import MomentUtils from '@date-io/moment'

import Error from '../Shared/Error'
import { GET_SHOWS_QUERY } from '../../pages/App'

const CreateShow = ({ classes }) => {
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [url, setUrl] = useState('')
  const [duration, setDuration] = useState('')
  const [startTime, handleDateChange] = useState(new Date())
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (event, createShow) => {
    event.preventDefault()
    setSubmitting(true)
    createShow({ variables: { title, description, url, duration, startTime }})
  }

  return (
    <>
      <Button onClick={() => setOpen(true)} variant='fab' className={classes.fab} color='secondary' >
        {open ? <ClearIcon /> : <AddIcon />}
      </Button>

      <Mutation
        mutation={CREATE_SHOW_MUTATION}
        onCompleted={data => {
          setSubmitting(false)
          setOpen(false)
          setTitle('')
          setDescription('')
          setUrl('')
          handleDateChange('')
          setDuration('')
        }}
        refetchQueries={() => [{ query: GET_SHOWS_QUERY }]}
      >
        {(createShow, { loading, error }) => {
          if (error) return <Error error={error} />
          return (
            <Dialog open={open} className={classes.dialog}>
              <form onSubmit={event => handleSubmit(event, createShow)}>
                <DialogTitle>Add a Show</DialogTitle>
                <DialogContent>
                  <DialogContentText>
                    Add a title, description, date, time, duration, and url
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
                  <MuiPickersUtilsProvider utils={MomentUtils}>
                    <KeyboardDateTimePicker
                      variant="inline"
                      label="Start Time"
                      value={startTime}
                      onChange={handleDateChange}
                      onError={console.log}
                    />
                  </MuiPickersUtilsProvider>
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
                      submitting || !title.trim() || !description.trim()
                    }
                    type='submit'
                    className={classes.save}
                  >
                    {submitting ? (
                      <CircularProgress className={classes.save} 
                        size={24}
                      />
                    ) : (
                      'Add Show'
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
}

const CREATE_SHOW_MUTATION = gql`
  mutation ($title: String!, $description: String!, $url: String!, $duration: String!, $startTime: DateTime!) {
    createShow(title: $title, description: $description, url: $url, duration: $duration, startTime: $startTime)
    {
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
  },
  fab: {
    position: "fixed",
    bottom: theme.spacing.unit * 2,
    right: theme.spacing.unit * 2,
    zIndex: "200"
  }
})

export default withStyles(styles)(CreateShow)