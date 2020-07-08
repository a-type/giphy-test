# signal-giphy

## Devlog

Hello! I'll try to jot down thoughts here as I work, as well as a rough timetable.

To begin, I'll break down my anticipated work and how I think I might tackle this based on the requirements. I like to use Github's built-in project management tools for simple projects, so I'll be making some cards and a board there. If you're interested in how I broke down the work initially, the issue list should show the history. Of course, things rarely go perfectly to plan. I'll try to tag the issues with the time spent as well to keep the timeline transparent.

### Choices

#### Boilerplate: CRA + TS + Redux

To start, I opted for the Typescript+Redux template for CRA, since I don't want to waste time on Redux setup boilerplate. To be honest it's been a minute since I set up a Redux app - I've been mostly using Apollo Client with GraphQL and hadn't felt the need to pull Redux back into any recent projects. I'm also pretty interested in trying [Recoil](https://recoiljs.org/) the next time I do a small app like this.

#### State shape

I'm keeping it simple on the Redux side. There's only two pieces of state that appear to be reused in multiple components: the search term, and the currently focused GIF (for full screen view). The former will be sourced from a search component and utilized in the result grid. The latter will be updated from the grid (on click) but rendered in a separate modal component.

So for the time being, my state is:

```
{
  gifs: {
    searchQuery: string,
    focusedGifId: string
  }
}
```

#### Async

All the fetching can be done pretty easily using the Giphy SDK. However, their out-of-the-box components contain some... strange design decisions. Namely, coupling the `Grid` component with the data-fetching functions from the SDK. The Grid accepts a fetcher function as a prop and calls it internally; it doesn't provide a way for the user to call it themselves and pass the data along manually. For that reason, it's going to be awkward integrating the Giphy fetching functionality into a more typical Redux async flow, like thunk actions.

I opted to err on the side of working with the tools provided instead of against them. Having a library with pre-built solutions provided by a third party service is nearly always a benefit versus DIY (i.e. _Not Invented Here_ syndrome). So rather than put the async code into the Redux logic, I'll just do the fetching within the normal component lifecycle and use Redux purely as a state store.

It was pretty trivial to whip up a hook which returns a Giphy gifs fetcher function - basically a fetcher function factory (glad I don't have to say that out loud). It returns the right fetcher based on the search term (if any).

I followed that up with another hook that fetches a single GIF for the lightbox. This is a bit more typical async faire (since Giphy does the sensible thing and lets you fetch it yourself), so I've adopted a pretty common hook design pattern of tracking and returning `{ gif, loading, error }`, and using `useEffect` to refetch the data as the declarative input changes.

#### Design

TODO

## CRA boilerplate

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app), using the [Redux](https://redux.js.org/) and [Redux Toolkit](https://redux-toolkit.js.org/) template.

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.<br />
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
