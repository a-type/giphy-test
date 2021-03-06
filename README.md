# giphy-test

## A recap of choices made

To start, here's a quick overview of some 'default' choices I usually make in a project. I'm not dogmatic about these things, but if it's just me working on something, this represents my choices. In the code itself, I also put `@note` annotations in various comments where I thought something was worth explaining.

### Create React App for small scope pages (NextJS for larger scope apps)

I like to skip the boilerplate. There was a long period of my career when I prided myself on writing custom Webpack configs to suit the exact needs of a project, and I can still do that. But the more projects I start, the more I appreciate getting to the good part quick. Ultimately, it doesn't matter if I don't use the PostCSS loader CRA ships me by default - the experience that's delivered to the user isn't really affected by it being there.

For larger projects I'm really loving NextJS. Server-side rendering seemed like a dream until I tried it - now it's just a given.

### Material UI as a core component library

Again, I went through a phase of Not Invented Here where I enjoyed building up my own basic components from scratch. I learned a lot from that. But when I finally dove into the codebase of Material UI to see what I was missing out on, I started to understand the incredible wealth of experience gathered from all the contributors far surpasses anything I could do on my own. As a solo developer or on a team, there's always a level of scarcity - of time, focus, expertise. I want to be able to deliver a first-rate app experience in terms of accessibility, micro-interactions, and consistent design - without those things taking all my time away from actually implementing the real functionality of the app. MUI enables that with a level of customizability which I would say is unparalleled in the current React world.

I also like to use Material-UI's default JSS styling solution, which is bundled with the library. I've tried various JSS and CSS solutions over the years, and I've found they're all pretty good. Convenience is really the factor here.

### Typescript, strict mode

Strict mode sometimes feels like overkill. I definitely considered dropping it on this project due to the time constraints. But I do think that addressing the problem of `null` pays for itself eventually, regardless of scale. I'd rather spend my time annotating my functions thoroughly (a well-defined quantity of work) than hunting a bug at runtime (a potentially undefined quantity of work). It's far easier to start in strict mode than it is to adopt it later.

### Prettier, always

I adopted Prettier a few years ago and now I can't live without it. In my opinion it's a no-brainer for teams of any size. Prettier is not just about code style opinions, it's about freeing up my headspace from having to think about whether I was supposed to put the ternary operator characters on a new line or not. I can just focus on the logic, hit save, and the code sorts itself out. It really has been an unexpected game-changer for my efficiency.

### Testing

I'll admit up front I don't do test-driven development universally. Like many techniques, I find it has a place. I generally will write unit tests first if I know there is a well defined, small unit of behavior and I have ideas about the expected outcomes. But I find in a lot of projects, especially explorations like this one, if I write tests first they quickly become irrelevant as the implementation draws out new details I didn't anticipate.

For this project, I opted to wait until the end for testing, and I used it concisely to ensure I'd covered some corner cases and double-check that my behaviors worked as expected.

### Masonry grid

Initially, I used an out-of-the-box grid solution from Giphy to implement the requirements. However, I grew a bit dissatisfied with some aspects of the usage. Since I had a good chunk of time remaining, I decided to try making my own masonry layout, since I already understood the theory of it. I also wanted to incorporate element virtualization (windowing / culling), because rendering hundreds of GIFs as you scroll takes a toll on performance. I was able to accomplish these objectives, although it did comprise the bulk of the work. There's more detail in the devlog.

## Devlog

Hello! I'll try to jot down thoughts here as I work, as well as a rough timetable.

To begin, I'll break down my anticipated work and how I think I might tackle this based on the requirements. I like to use Github's built-in project management tools for simple projects, so I'll be making some cards and a board there. If you're interested in how I broke down the work initially, the issue list should show the history. Of course, things rarely go perfectly to plan. I'll try to tag the issues with the time spent as well to keep the timeline transparent.

### Day 1 (Hours 0-2)

#### Boilerplate: CRA + TS + Redux

To start, I opted for the Typescript+Redux template for CRA, since I don't want to waste time on Redux setup boilerplate. To be honest it's been a minute since I set up a Redux app - I've been mostly using Apollo Client with GraphQL and hadn't felt the need to pull Redux back into any recent projects. I'm also pretty interested in trying [Recoil](https://recoiljs.org/) the next time I do a small app like this.

#### Material UI

As usual, I whipped up the basic scaffolding for the Material-UI component library, including a simple dark theme.

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

The page design is very minimal right now; a single column of GIFs with a search bar that sticks to the top. I don't anticipate that changing much.

### Day 2 (Hrs 2-7)

Starting out on my second session of work for this project, I reflected a bit on the functionality so far. There are a few things I'm not thrilled about.

Because of the design if Giphy's own `Grid` component, I don't really have access to the GIFs which are fetched as part of the main "list GIFs" operation on the page. It requires me to pass a fetcher function in as a prop, and never really gives me a chance to cache or otherwise store the fetched data in state. This feels more and more like an antipattern in their tooling to me - it definitely gets you off the ground quick, but the cost is basically any level of flexibility.

Because of that, I never store the GIF data in my application's managed state in Redux, so I don't have a way to reuse that data when I'm rendering GIFs in a different context - specifically, the lightbox full-screen view. Instead, I opted to refetch the GIF in that view. That's an extra request that really isn't necessary.

On top of that, I'd like to have a bit more freedom in general in how I display the grid of GIFs. When I started on the project, before thinking about implementation, I had ideas about cool animations or a more tailored experience than the `Grid` component allows (again, ease of use vs. flexibility).

So with that, I decided to focus an hour or so on coming up with a better solution for my needs.

#### Creating a new Masonry Grid

To be honest, I kind of wanted to try to make a masonry grid anyway. It's a fun challenge. I needed a good starting point, so I referred to Giphy's source code and noticed they're using one of their packages, `@giphy/js-util`, to do measurements on the GIF images, which I could also build from.

But as long as I'm making one from scratch, why not make it better? Giphy's Grid relied on the user supplying a static width, which makes responsiveness a bit more fiddly to pull off. It's easy enough to measure the width of an element, so I could incorporate that to bring some intelligence to the layout.

Another thing missing from Giphy's implementation is virtualization. When GIFs are offscreen, there's no reason to keep rendering them. One of the nice things about a masonry layout is that, while it can be trickier to implement, it makes virtualization pretty simple since all elements are positioned in an absolute sense. You simply don't render the elements you can't see anymore. To accomplish that, I just had to track scroll position and incorporate it into my masonry calculations.

#### Improvements to state and request efficiency

The nice thing about moving the Giphy data into my state store is that I now have a cached data item for each GIF I can lookup by ID at my command. That means I can eliminate the unnecessary fetch of a GIF when I open it in lightbox mode. Instead, I just select the GIF out of my store when the user chooses one by storing its ID. I removed the extra request and replaced it with a selector, which worked great.

#### Pivoting to async Redux

Now that I'm no longer relying on Giphy's opinionated fetch system with Grid to fetch GIFs, I needed to start thinking about how to integrate asynchronous fetching into Redux.

Historically I've used `redux-saga`, and I'm still a fan of the generator pattern for asynchronous control flow. Describing effects rather than executing them is incredibly powerful once you get over the learning curve. However, I knew this code was going to need to be read and understood by others (hello!), and I believe in taking such things into consideration when making choices on libraries and patterns. There are a multitude of ways to solve problems in code; it's not really about whether I _can_ solve it, but _how_ and _why_. After using `redux-saga` on a team of diverse industry backgrounds and varying experience, I know firsthand how much of a burden the learning curve can be, even with the benefits of the more functional model.

So instead, I went back to the basics with `redux-thunk`. It's a solid pattern, requires little boilerplate, and the code is pretty easy to understand if you're familiar with the `async/await` pattern. I'm a fan, and it was nice to use it again - I hadn't done so probably since I started learning Redux 5 or so years ago.

#### Fixing duplication

One of the quirks of pulling infinite paginated items is that items can be duplicated when you don't have a stable cursor-based pagination system. Giphy uses offset-based pagination, so duplicate items show up occasionally. React dutifully warns when it detects items with identical `key` props in the list, which is how I picked up on it.

To fix that, I had to implement a basic list deduplication technique using the id of each GIF object. It's kind of a classic interview puzzle I guess. I did it using a hash map, storing the count of each id on a first pass of the list, then decrementing those counts on a second pass until they reached 0 before adding the item back to a new list. Harder to explain in words, but [the code is documented](./src/utils/deduplicateById.ts) and unit tested just to be sure.

#### Polish

The rest of my time during this session was just polishing the details. I added an animation as GIFs appear onscreen - nothing much, just a small touch. I also made the lightbox expand to take up 3/4 of the screen width.

### Day 3 (Hrs 7-8)

The final session was basically figuring out the deployment (pretty easy with Github Pages and Github Actions) and writing a few simple unit tests, then completing the documentation you're reading.

## CRA boilerplate stuff below!

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
