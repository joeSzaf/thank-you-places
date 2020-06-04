import React, { useState } from "react"
import withStyles from "@material-ui/core/styles/withStyles"
import Button from "@material-ui/core/Button"
import Snackbar from "@material-ui/core/Snackbar"
import { withTheme } from "@material-ui/core"

const Error = ({ classes, error }) => {
  const [open, setOpen] = useState(true)

  return (
    <Snackbar
    open={open}
      className={classes.snackbar}
      message={error.message}
      action={
        <Button
          onClick={() => setOpen(false)}
          size='small'
          className={classes.buttonText}
        >
          close
        </Button>
      }
    />
  )
}

const styles = theme => ({
  snackbar: {
    margin: theme.spacing.unit
  },
  buttonText: {
    color: 'white'
  }
})

export default withStyles(styles)(Error)
