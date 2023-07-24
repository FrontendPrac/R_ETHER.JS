import React from "react";

const ConnectButton = (props) => {
  const { isConnected, connectWallet } = props;

  return (
    <div
      style={{ border: "1px solid black", margin: "40px" }}
      onClick={connectWallet}
    >
      ConnectWallet
    </div>
  );
};

export default ConnectButton;
