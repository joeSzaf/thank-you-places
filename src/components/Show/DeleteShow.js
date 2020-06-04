import React, { useContext } from "react"
import { Mutation } from 'react-apollo'
import { gql } from 'apollo-boost'
import IconButton from "@material-ui/core/IconButton"
import TrashIcon from "@material-ui/icons/DeleteForeverOutlined"

import { UserContext } from '../../Root'
import { GET_SHOWS_QUERY } from '../../pages/App'

const DeleteShow = ({ show }) => {
  const currentUser = useContext(UserContext)
  const isCurrentUser = currentUser.id === show.postedBy.id

  // const handleUpdateCache = (cache, { data: { deleteShow } } ) => {
  //   const data = cache.readQuery({ query: GET_SHOWS_QUERY })
  //   const index = data.shows.findIndex(
  //     show => Number(show.id) === deleteShow.showId
  //   )
  //   const shows = [...data.shows.slice(0, index), ...data.shows.slice(index + 1)]
  //   cache.writeQuery({ query: GET_SHOWS_QUERY, data: { shows } })
  // }

  return isCurrentUser && (
    <Mutation
      mutation={DELETE_SHOW_MUTATION}
      variables={{ showId: show.id }}
      onCompleted={data => {
        console.log(data)
      }}
      // update={handleUpdateCache}
      refetchQueries={() => [{ query: GET_SHOWS_QUERY }]}
    >
      {deleteShow => (
        <IconButton onClick={deleteShow}>
          <TrashIcon />
        </IconButton>
      )}
    </Mutation>
  )
}

const DELETE_SHOW_MUTATION = gql`
  mutation($showId: Int!) {
    deleteShow(showId: $showId) {
      showId
    }
  }
`

export default DeleteShow
