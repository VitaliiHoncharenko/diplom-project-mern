import React from 'react'
import LoaderSpinner from 'react-loader-spinner'

export const Loader = () => (
  <LoaderSpinner
    className="app__loader"
    type="TailSpin"
    color="#ffffff"
    height={100}
    width={100}
  />
);
