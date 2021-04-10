import React from 'react';
import { render, screen, } from '@testing-library/react';
import Stories from './Stories';
import Adapter from 'enzyme-adapter-react-16';
import { shallow, configure } from 'enzyme';
import waitUntil from 'async-wait-until';

const stories = [{
  by: "caspii",
  descendants: 52,
  id: 26759680,
  kids: [26760087],
  score: 86,
  time: 1618039905,
  title: "Test Event Strory Title",
  type: "story",
  url: "https://teststory.com/"
}]

configure({ adapter: new Adapter() });

describe("Stories Component Test cases", () => {
  test('Renders Story Book title', () => {
    render(<Stories />);
    const devElement = screen.getByText('Story Book');
    expect(devElement).toBeInTheDocument();
  });

  test('Render Story Book list', async () => {
    const StoriesComponent = shallow(<Stories />);
    StoriesComponent.setState({ topStories: stories })
    jest.spyOn(StoriesComponent.instance(), 'get')
    expect(StoriesComponent.find("#toggle").html()).toContain("1 comments")

  });

  test('Clicking on comments', async () => {
    const StoriesComponent = shallow(<Stories />);
    StoriesComponent.setState({ topStories: stories })
    jest.spyOn(StoriesComponent.instance(), 'handleSelectStory')
    StoriesComponent.find("#toggle").simulate('click')
    expect(StoriesComponent.instance().handleSelectStory).toHaveBeenCalledTimes(1);
    StoriesComponent.find("#toggle").simulate('click')
  });

  test('Calling internal "handleSelectStory" methods', async () => {

    const StoriesComponent = shallow(<Stories />);
    StoriesComponent.setState({ topStories: stories })
    jest.spyOn(StoriesComponent.instance(), 'get')
    await StoriesComponent.instance().handleSelectStory(stories[0], 'comment');
    expect(StoriesComponent.instance().state.selectedStory).toEqual(stories[0]);
    expect(StoriesComponent.instance().get).toHaveBeenCalledTimes(1);
    StoriesComponent.instance().handleSelectStory(null, '');
  });
  test('Calling componentDidMount for stories', async () => {
    const StoriesComponent = shallow(<Stories />);
    await waitUntil(() => StoriesComponent.instance().componentDidMount);
  }, 50000);

  test('Calling get Method', async () => {
    const StoriesComponent = shallow(<Stories />);
    StoriesComponent.setState({ topStories: [{ ...stories[0], kids: [] }] })
    jest.spyOn(StoriesComponent.instance(), 'get');
    await waitUntil(() => StoriesComponent.instance().get(stories[0].kids, ''));
    expect(StoriesComponent.instance().get).toHaveBeenCalledTimes(1);
  }, 100000);
});

