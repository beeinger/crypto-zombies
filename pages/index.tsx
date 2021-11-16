import React, { useEffect, useState } from "react";

import useCryptoZombies from "hooks/useCryptoZombies";

export default function Index() {
  const { ready, getAllZombies, createAZombie } = useCryptoZombies(),
    [zombies, setZombies] = useState<any[]>([]);

  useEffect(() => {
    getAllZombies().then(setZombies);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready]);

  return (
    <div>
      {JSON.stringify(zombies)}
      <button onClick={() => createAZombie("Beeinger")}>Create a zombie</button>
    </div>
  );
}
