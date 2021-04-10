import React, { Component } from 'react';
import { GetStories, GetStoryById } from '../../services/Service'
import ListGroup from 'react-bootstrap/ListGroup'
import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button'
import Accordion from 'react-bootstrap/Accordion'

import moment from 'moment';




class Stories extends Component {
    constructor() {
        super()
        this.state = {
            topStories: [],
            selectedStory: null,
            commects: [],
            activeKey: ''
        }
        this.setData = this.setData.bind(this)
    }

    componentDidMount() {
        GetStories().then((stories) => {
            this.get(stories.slice(0, 10), 'story')
        })
    }

    getRandomColor() {
        var letters = '0123456789ABCDEF';
        var color = '#';
        for (var i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }

    get(source, type) {
        let allRes = []
        source.map((id) => {
            GetStoryById(id).then((response) => {
                allRes = [...allRes, { ...response, background: this.getRandomColor() }]
                this.setData(allRes, type)
            })
        })
    }

    setData(data, type) {
        if (type === 'story') {
            this.setState({ topStories: data })
        }
        else if (type === 'comment') {
            this.setState({ commects: data })
        }
    }

    handleSelectStory(story, activeKey) {
        if (this.state.selectedStory !== story) {
            this.setState({ selectedStory: story })
            if (story && story.kids?.length) {
                this.get(story.kids.slice(0, 20), 'comment')
            }
            else {
                this.setState({ commects: [] })
            }
        }
        if (this.state.activeKey === activeKey) {
            this.setState({ activeKey: "" })
        } else {
            this.setState({ activeKey })
        }
    }

    render() {
        const { topStories, activeKey, commects } = this.state
        return (<div>
            <div style={{ height: '30px', textAlign: 'center', background: '#bee5eb' }}><b style={{ fontSize: '22px', color: 'cadetblue' }}>{'Story Book'}</b></div>
            <ListGroup>
                {topStories.map((story, index) =>
                    <ListGroup.Item key={index} action key={index} variant="info">
                        <Card>
                            <Card.Body>
                                <Card.Title>
                                    <div style={{ height: '25px' }}>
                                        <div style={{ height: '25px', width: '25px', background: story.background, float: 'left', marginRight: '10px', borderRadius: '50px', color: 'white', textAlign: 'center' }}>
                                            <b>{story.by[0]?.toUpperCase()}</b>
                                        </div>
                                        <div>{story.by}</div>
                                        <div style={{ float: 'right', fontSize: 10, marginTop: '-16px' }}>
                                            {moment.unix(story.time).format('dddd MMMM Do YYYY, h:mm:ss a')}
                                        </div>
                                    </div></Card.Title>
                                <Card.Subtitle style={{ fontSize: 'small' }} className="mb-2 text-muted">Score: {story.score}</Card.Subtitle>
                                <Card.Text>
                                    Story: <b>{story.title}</b>
                                </Card.Text>
                                <Card.Link href={story.url}>{story.url}</Card.Link>
                            </Card.Body>
                            <Card.Footer>
                                <Accordion>
                                    <Accordion.Toggle id={"toggle"} as={Button} onClick={() => this.handleSelectStory(story, index.toString())} variant="text" eventKey={''}>
                                        {`${story?.kids?.length ? story?.kids?.length : 0} comments`}
                                    </Accordion.Toggle>
                                    <div style={{ maxHeight: '508px', overflow: 'auto' }}>
                                        <Accordion.Collapse className={activeKey === index.toString() ? 'show' : ''} eventKey={''}>
                                            <Card.Body>
                                                {commects.map((comment, inx) =>
                                                    <ListGroup.Item action variant="dark" key={inx}>
                                                        <Card>
                                                            <Card.Body>
                                                                <Card.Title>
                                                                    <div style={{ height: '25px' }}>
                                                                        <div style={{ height: '25px', width: '25px', background: comment.background, float: 'left', marginRight: '10px', borderRadius: '50px', color: 'white', textAlign: 'center' }}>
                                                                            <b>{comment?.by?.length ? comment?.by[0]?.toUpperCase() : ''}</b>
                                                                        </div>
                                                                        <div>
                                                                            {comment.by}
                                                                        </div>
                                                                    </div>
                                                                </Card.Title>
                                                                <Card.Subtitle style={{ fontSize: 'small' }} className="mb-2 text-muted">{moment.unix(comment.time).format('dddd MMMM Do YYYY, h:mm:ss a')}</Card.Subtitle>
                                                                <Card.Text>
                                                                    <b dangerouslySetInnerHTML={{ __html: comment.text }}></b>
                                                                </Card.Text>
                                                            </Card.Body>
                                                        </Card>
                                                    </ListGroup.Item>)}
                                            </Card.Body>
                                        </Accordion.Collapse>
                                    </div>
                                </Accordion>
                            </Card.Footer>
                        </Card>
                    </ListGroup.Item>)}
            </ListGroup>
        </div>

        );
    }
}

export default Stories;