import React from "react";

import { APP_STATES } from "../utils/types";
import AppBody from "../components/AppBody";
import { createStream, getStreamStatus } from "../utils/apiFactory";

declare global {
  interface Window {
    ethereum: any;
    web3: any;
  }
}

const INITIAL_STATE = {
  appState: APP_STATES.API_KEY,
  apiKey: null,
  jwPlayerAPIKey: null,
  jwPlayerSecret: null,
  streamTitle: null,
  streamId: null,
  playbackId: null,
  streamKey: null,
  streamIsActive: false,
  jwPlayerHostedLibraryLink: null,
  error: null,
};

const reducer = (state, action) => {
  switch (action.type) {
    case "SUBMIT_INPUTS":
      return {
        ...state,
        appState: APP_STATES.CREATE_BUTTON,
        apiKey: action.payload.apiKey,
        jwPlayerAPIKey: action.payload.jwPlayerAPIKey,
        jwPlayerSecret: action.payload.jwPlayerSecret,
        streamTitle: action.payload.streamTitle,
      };
    case "CREATE_CLICKED":
      return {
        ...state,
        appState: APP_STATES.CREATING_STREAM,
      };
    case "STREAM_CREATED":
      return {
        ...state,
        appState: APP_STATES.WAITING_FOR_VIDEO,
        streamId: action.payload.streamId,
        playbackId: action.payload.playbackId,
        streamKey: action.payload.streamKey,
        jwPlayerHostedLibraryLink: action.payload.jwPlayerHostedLibraryLink,
        divKey: action.payload.divKey,
      };
    case "VIDEO_STARTED":
      return {
        ...state,
        appState: APP_STATES.SHOW_VIDEO,
        streamIsActive: true,
      };
    case "VIDEO_STOPPED":
      return {
        ...state,
        appState: APP_STATES.WAITING_FOR_VIDEO,
        streamIsActive: false,
      };
    case "RESET_DEMO_CLICKED":
      return {
        ...INITIAL_STATE,
      };
    case "INVALID_API_KEY":
      return {
        ...state,
        error: action.payload.message,
      };
    default:
      break;
  }
};

export default function Stream() {
  const [state, dispatch] = React.useReducer(reducer, INITIAL_STATE);

  React.useEffect(() => {
    if (state.appState === APP_STATES.CREATING_STREAM) {
      (async function () {
        try {
          const streamCreateResponse = await createStream(
            state.apiKey,
            state.jwPlayerAPIKey,
            state.jwPlayerSecret,
            state.streamTitle
          );
          if (streamCreateResponse.data) {
            const {
              id: streamId,
              playbackId,
              streamKey,
              jwPlayerHostedLibraryLink,
              divKey,
            } = streamCreateResponse.data;
            dispatch({
              type: "STREAM_CREATED",
              payload: {
                streamId,
                playbackId,
                streamKey,
                jwPlayerHostedLibraryLink,
                divKey,
              },
            });
          }
        } catch (error) {
          if (error.response.status === 403) {
            dispatch({
              type: "INVALID_API_KEY",
              payload: {
                message:
                  "Invalid API Key. Please try again with right API key!",
              },
            });
          } else {
            dispatch({
              type: "INVALID_API_KEY",
              payload: {
                message:
                  "Something went wrong! Please try again after sometime",
              },
            });
          }
        }
      })();
    }

    let interval;
    if (state.streamId) {
      interval = setInterval(async () => {
        const streamStatusResponse = await getStreamStatus(
          state.apiKey,
          state.streamId
        );
        if (streamStatusResponse.data) {
          const { isActive } = streamStatusResponse.data;
          dispatch({
            type: isActive ? "VIDEO_STARTED" : "VIDEO_STOPPED",
          });
        }
      }, 5000);
    }

    return () => {
      clearInterval(interval);
    };
  }, [state.appState]);

  return (
    <main className="container pb-12 h-screen m-auto pt-24 lg:pt-40">
      <header className="w-full p-3 flex justify-between items-center fixed top-0 left-0 z-10 bg-white">
        <a
          href="https://livepeer.com/docs/"
          target="_blank"
          rel="noopener, nofollow"
          className="logo flex flex-col flex-1 lg:w-1/5"
        >
          <h1 className="font-bold text-xl">Livepeer.com API Demo</h1>
        </a>

        <button
          className="border p-2 h-1/2 rounded-2xl border-livepeer hover:bg-livepeer hover:text-white "
          onClick={() => dispatch({ type: "RESET_DEMO_CLICKED" })}
        >
          Reset Demo
        </button>
      </header>
      <AppBody
        state={state}
        setApiKey={(apiKey, jwPlayerAPIKey, jwPlayerSecret, streamTitle) =>
          dispatch({
            type: "SUBMIT_INPUTS",
            payload: { apiKey, jwPlayerAPIKey, jwPlayerSecret, streamTitle },
          })
        }
        createStream={() => dispatch({ type: "CREATE_CLICKED" })}
      />
      <footer className="fixed bottom-0 left-0 w-full h-12 flex items-center justify-center">
        Made with the&nbsp;
        <a href="https://livepeer.com/docs/" className="text-livepeer text-xl">
          Livepeer.com
        </a>
        &nbsp;API
      </footer>
      {state.error && (
        <div className="bg-black bg-opacity-60 flex items-center justify-center fixed top-0 left-0 h-screen w-screen">
          <div className="flex flex-col w-1/3 h-56 bg-white p-12 items-center text-center text-lg rounded">
            {state.error}
            <button
              className="border p-2 w-1/3 rounded border-livepeer hover:bg-livepeer hover:text-white mt-4"
              onClick={() => dispatch({ type: "RESET_DEMO_CLICKED" })}
            >
              Retry
            </button>
          </div>
        </div>
      )}
    </main>
  );
}

// const [account, setAccount] = React.useState(null);
//   const [web3, setWeb3] = React.useState(null);

//   const Web3Handler = async () => {
//     try {
//       const account = await window.ethereum.request({
//         method: "eth_requestAccounts",
//       });

//       const web3 = new Web3(window.ethereum);
//       setAccount(account[0]);
//       setWeb3(web3);
//     } catch (err) {
//       console.log(err);
//     }
//   };
