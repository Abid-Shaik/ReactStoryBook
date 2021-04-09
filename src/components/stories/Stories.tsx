
import * as React from 'react';
import { GetStories, GetStoryById } from '../../services/Service'
import { ListGroup, Card, Button, Accordion } from 'react-bootstrap'
import moment from 'moment';

type IProps = {

};
type IState = {
    topStories: Array<any>;
    selectedStory: any;
    commects: Array<any>;
    activeKey: string;

};
export default class Stories extends React.Component<IProps, IState>{
    constructor(props: IProps) {
        super(props)
        this.state = {
            topStories: [],
            selectedStory: null,
            commects: [],
            activeKey: ''
        }
    }

    componentDidMount() {
        GetStories().then((stories: Array<number>) => {
            if (stories && stories.length) {
                this.get(stories.slice(0, 10), 'story')
            }
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

    get(source: Array<number>, type: string) {
        let allRes: Array<any> = []
        source.map((id: number) => {
            GetStoryById(id).then((response: any) => {
                if (response) {
                    allRes = [...allRes, { ...response, background: this.getRandomColor() }]
                    if (type === 'story') {
                        this.setState({ topStories: allRes })
                    }
                    else if (type === 'comment') {
                        this.setState({ commects: allRes })
                    }
                }
            })
        })
    }

    handleSelectStory(story: any, activeKey: string) {
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
        return (
            <div>
                <ListGroup>
                    {topStories.map((story, index) =>
                        <ListGroup.Item action key={index} variant="info">
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
                                        <b>{story.title}</b>
                                    </Card.Text>
                                    <Card.Link href={story.url}>{story.url}</Card.Link>
                                </Card.Body>
                                <Card.Footer>
                                    <Accordion>
                                        <Accordion.Toggle as={Button} onClick={() => this.handleSelectStory(story, index.toString())} variant="text" eventKey={''}>
                                            {`${story?.kids?.length ? story?.kids?.length : 0} comments`}
                                        </Accordion.Toggle>
                                        <div style={{ maxHeight: '508px', overflow: 'auto' }}>
                                            <Accordion.Collapse className={activeKey === index.toString() ? 'show' : ''} eventKey={''}>
                                                <Card.Body>
                                                    {commects.map((comment) => <ListGroup.Item action variant="dark">
                                                        <Card>
                                                            <Card.Body>
                                                                <Card.Title>
                                                                    <div style={{ height: '25px' }}>
                                                                        <div style={{ height: '25px', width: '25px', background: '#808080', float: 'left', marginRight: '10px', borderRadius: '50px', color: 'white', textAlign: 'center' }}>
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
    };
};