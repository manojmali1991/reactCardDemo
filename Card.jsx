import React from 'react';
import {InfiniteScroll} from 'react-simple-infinite-scroll'
import WordInput from './wordInput.jsx'


// React component for the front side of the card
class CardFront extends React.Component {
    constructor(){
        super()
        this.state = {
            isLoading: true,
            cursor:0,
            data: []
        }
    }

    componentDidMount() {
        this.loadData()
    }
    loadData() {

        this.setState({isLoading: true})
        fetch(`http://localhost:8080/api/word?pageNumber=${this.state.cursor}&pageLimit=5`)
            .then(res => res.json())
            .then(res => {
                    this.setState(state =>({
                        data: [...this.state.data, ...res],
                        cursor: res.length>0?this.state.cursor+1:null,
                        isLoading: false
                    }))

                })

    }

    render() {
        return (
            <div>

                <InfiniteScroll
                    throttle={1}
                    threshold={60}
                    isLoading={this.state.isLoading}
                    hasMore={!!this.state.cursor}
                    onLoadMore={this.loadData.bind(this)}
                >
                    {this.state.data.length>0 ? this.state.data.map((word, i) => <Card key = {i} data = {word}/>)
                    :null}
                </InfiniteScroll>
                {this.state.isLoading && (<MyLoadingState/>)}
            </div>
        )
    }
}

class Card extends React.Component {
    render() {
        return(
            <label>
                <input type="checkbox"  className="invisible"/>
                <div className="card">
                    <div className="front">{this.props.data.word}</div>
                    <div className="back">
                        Meaning: {JSON.stringify(this.props.data.meaning)}<br/>
                        Synonyms: {JSON.stringify(this.props.data.synonyms)}
                    </div>
                </div>
            </label>
        )
    }
}

class MyLoadingState extends React.Component {
    render() {
        return(
            <div>Loading...</div>
        )
    }
}
export default CardFront