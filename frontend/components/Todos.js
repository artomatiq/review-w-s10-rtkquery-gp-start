import React from 'react'
import styled from 'styled-components'
import { useSelector, useDispatch } from 'react-redux'
import { toggleShowCompletedTodos } from '../state/todosSlice'

import { useGetTodosQuery, useToggleTodoMutation } from '../state/todosApi.js'

const StyledTodo = styled.li`
  text-decoration: ${pr => pr.$complete ? 'line-through' : 'initial'};
  cursor: pointer;
`

export default function Todo() {
  //rtk query
  const {data: todos, isLoading: todosLoading, isFetching: todosRefreshing } = useGetTodosQuery()  //isFetching is only for get queries, not mutations
  const [toggleTodo, {error: toggleError, isLoading: todosToggling}] = useToggleTodoMutation()
  // redux
  const showCompletedTodos = useSelector(st => st.todosState.showCompletedTodos)
  const dispatch = useDispatch()
  return (
    <div id="todos">
      <div className="error">{toggleError && toggleError.data.message}</div>
      <h3>Todos {(todosToggling || todosRefreshing) && 'updating...'}</h3>
      <ul>
        {
          todosLoading ? 'todos loading...' :
          todos?.filter(todo => {
            return showCompletedTodos || !todo.complete
          })
            .map(todo => {
              const onToggle = () => {
                toggleTodo({id: todo.id, todo: {complete: !todo.complete}})
              }
              return (
                <StyledTodo $complete={todo.complete} key={todo.id} onClick={onToggle}>
                  <span>{todo.label}{todo.complete && ' ✔️'}</span>
                </StyledTodo>
              )
            })
        }


      </ul>
      <button onClick={() => dispatch(toggleShowCompletedTodos())}>
        {showCompletedTodos ? 'Hide' : 'Show'} completed todos
      </button>
    </div>
  )
}
