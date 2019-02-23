import React, { Component } from 'react'
import { Link } from '../server/routes.js'
import reduxApi from '../redux/reduxApi.js'
import { withKittens } from '../redux/kittenProvider.js'

import PageHead from '../components/PageHead'
import KittenItem from '../components/KittenItem'

class IndexPage extends Component {
  static async getInitialProps ({ store, isServer, pathname, query }) {
    // Get all kittens
    const kittens = await store.dispatch(reduxApi.actions.kittens.sync())
    return { kittens }
  }

  constructor (props) {
    super(props)
    this.state = { name: '' }
  }

  handleChangeInputText (event) {
    this.setState({ name: event.target.value })
  }

  handleAdd (event) {
    // Progress indicator
    this.setState({ inProgress: true })
    const callbackWhenDone = () => this.setState({ name: '', inProgress: null })

    // Actual data request
    const newKitten = {
      name: this.state.name
    }
    this.props.dispatch(reduxApi.actions.kittens.post({}, { body: JSON.stringify(newKitten) }, callbackWhenDone))
  }

  handleUpdate (index, kittenId, event) {
    // Progress indicator
    this.setState({ inProgress: kittenId })
    const callbackWhenDone = () => this.setState({ inProgress: null })

    // Actual data request
    const newKitten = {
      name: window.prompt('New name?')
    }
    this.props.dispatch(reduxApi.actions.kittens.put({ id: kittenId }, { body: JSON.stringify(newKitten) }, callbackWhenDone))
  }

  handleDelete (index, kittenId, event) {
    // Progress indicator
    this.setState({ inProgress: kittenId })
    const callbackWhenDone = () => this.setState({ inProgress: null })

    // Actual data request
    this.props.dispatch(reduxApi.actions.kittens.delete({ id: kittenId }, callbackWhenDone))
  }

  render () {
    const { kittens } = this.props// dd

    const kittenList = kittens.data
      ? kittens.data.map((kitten, index) => <KittenItem
        key={index}
        kitten={kitten}
        index={index}
        inProgress={this.state.inProgress}
        handleUpdate={this.handleUpdate.bind(this)}
        handleDelete={this.handleDelete.bind(this)}
      />)
      : []

    return <main>
      <PageHead
        title='Next.js (React) + Express REST API + MongoDB + Mongoose-Crudify boilerplate'
        description='Demo of nextjs-express-mongoose-crudify-boilerplate'
      />

      <h1>Kittens</h1>

      {kittenList}
      <div>
        <input placeholder='Enter a kitten name' value={this.state.name} onChange={this.handleChangeInputText.bind(this)} disabled={this.state.inProgress} />
        <button onClick={this.handleAdd.bind(this)} disabled={this.state.inProgress}>Add kitten</button>
        <style jsx>{`
          div {
            margin-top: 1em;
          }
        `}</style>
      </div>

      <h2>Routing</h2>

      <ul>
        <li><Link route='/about'><a>About</a></Link></li>
        <li><Link route='/more/contact'><a>Contact</a></Link></li>
      </ul>

    </main>
  };
}

export default withKittens(IndexPage)
