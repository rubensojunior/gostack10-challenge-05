import React, { Component } from 'react'
import { FaGithubAlt, FaPlus, FaSpinner } from 'react-icons/fa'
import { Link } from 'react-router-dom'

import api from '../../services/api'

import Container from '../../components/Container'
import { Form, SubmitButton, List, Input } from './styles'

export default class Main extends Component {
  constructor() {
    super()

    this.state = {
      newRepo: '',
      repositories: [],
      loading: false,
      error: false,
    }
  }

  componentDidMount() {
    const repositories = localStorage.getItem('repositories')

    if (repositories) {
      this.setState({ repositories: JSON.parse(repositories) })
    }
  }

  componentDidUpdate(_, prevState) {
    const { repositories } = this.state

    if (prevState.repositories !== repositories) {
      localStorage.setItem('repositories', JSON.stringify(repositories))
    }
  }

  handleInputChange = e => {
    this.setState({ newRepo: e.target.value })
  }

  handleSubmit = async e => {
    e.preventDefault()

    this.setState({ loading: true })

    try {
      const { newRepo, repositories } = this.state

      if (repositories.some(repository => repository.name === newRepo)) {
        throw new Error('Repositório duplicado')
      }

      const response = await api.get(`/repos/${newRepo}`)

      const data = {
        name: response.data.full_name,
      }

      this.setState({
        repositories: [...repositories, data],
        newRepo: '',
        loading: false,
        error: false,
      })
    } catch (err) {
      if (!err.response) {
        alert(err)
      }

      this.setState({
        loading: false,
        error: true,
      })
    }
  }

  render() {
    const { newRepo, loading, repositories, error } = this.state

    return (
      <Container>
        <h1>
          <FaGithubAlt />
          Repositóries
        </h1>

        <Form onSubmit={this.handleSubmit}>
          <Input
            type="text"
            placeholder="Adicionar repositório"
            value={newRepo}
            onChange={this.handleInputChange}
            error={error}
          />
          <SubmitButton loading={loading}>
            {loading ? (
              <FaSpinner color="#FFF" size={14} />
            ) : (
              <FaPlus color="#FFF" size={14} />
            )}
          </SubmitButton>
        </Form>

        <List>
          {repositories.map(repo => (
            <li key={repo.name}>
              <span>{repo.name}</span>
              <Link to={`/repository/${encodeURIComponent(repo.name)}`}>
                Detalhes
              </Link>
            </li>
          ))}
        </List>
      </Container>
    )
  }
}
