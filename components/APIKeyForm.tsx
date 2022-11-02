import React from "react";

interface Props {
  setApiKey: (
    apiKey: string,
    jwPlayerAPIKey: string,
    jwPlayerSecret: string,
    streamTitle: string
  ) => void;
}
const APIKeyForm: React.FC<Props> = ({ setApiKey }) => {
  const submitHandler = (event: React.SyntheticEvent) => {
    const {
      apiKey,
      jwPlayerAPIKey,
      jwPlayerSecret,
      streamTitle,
    } = event.target as HTMLFormElement;

    setApiKey(
      apiKey.value,
      jwPlayerAPIKey.value,
      jwPlayerSecret.value,
      streamTitle.value
    );
  };

  return (
    <div>
      <form
        className="px-4 h-3/5 flex justify-center flex-col lg:max-w-screen-md m-auto"
        onSubmit={submitHandler}
      >
        <div className="flex flex-col border-[2px] border-black py-2 text-center">
          <h1 className="font-bold underline text-xl">For Demo Purposes:</h1>
          <p className="font-bold">
            LivePeer API Key: 9fcff099-e211-4847-8e62-a85dd15c1506
          </p>
          <p className="font-bold">JWPlayer API Key: iSIdxRsD</p>
          <p className="font-bold">JWPlayer Secret: Rn9V4gVAxsTlJ5LOEjAPUMvY</p>
        </div>
        <br />
        <label htmlFor="apiKey">Livepeer.com API KEY:</label>
        <input
          type="text"
          placeholder="Enter your api key"
          className="border border-black active:border-livepeer p-2 w-full rounded mb-8 input input-bordered"
          name="apiKey"
          required
        />

        <label htmlFor="apiKey">JWPlayer:</label>
        <input
          type="text"
          placeholder="Enter JWPlayer API Key"
          className="border border-black active:border-livepeer p-2 w-full rounded mb-2 input input-bordered"
          name="jwPlayerAPIKey"
          required
        />
        <input
          type="text"
          placeholder="Enter JWPlayer API Secret"
          className="border border-black active:border-livepeer p-2 w-full rounded mb-4 input input-bordered"
          name="jwPlayerSecret"
          required
        />

        <label>Video Title:</label>
        <input
          type="text"
          placeholder="Enter video title"
          className="border border-black active:border-livepeer p-2 w-full rounded mb-4 input input-bordered"
          name="streamTitle"
          defaultValue="Livepeer Demo"
        />
        <button
          type="submit"
          className="btn btn-ghost border border-1 border-black rounded px-4 py-2 lg:w-24 mx-auto"
        >
          Start!
        </button>
      </form>
    </div>
  );
};

export default APIKeyForm;
