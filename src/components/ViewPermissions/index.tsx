'use client';

import { ListItem } from '@worldcoin/mini-apps-ui-kit-react';
import { MiniKit } from '@worldcoin/minikit-js';
import { useMiniKit } from '@worldcoin/minikit-js/minikit-provider';
import { useEffect, useState } from 'react';
/**
 * This component is an example of how to view the permissions of a user
 * It's critical you use Minikit commands on client components and ensure
 * the app is running inside World App
 */

export const ViewPermissions = () => {
  const [permissions, setPermissions] = useState<Record<string, boolean>>({});
  const [error, setError] = useState<string | null>(null);
  const { isInstalled } = useMiniKit();

  useEffect(() => {
    const initializeAndFetchPermissions = async () => {
      try {
        // First, check if we're running inside World App
        if (!isInstalled) {
          setError('Please open this app in World App to use this feature');
          return;
        }

        // Initialize MiniKit
        try {
          await MiniKit.install();
        } catch (initError) {
          console.error('Failed to initialize MiniKit:', initError);
          setError('Failed to initialize MiniKit. Please make sure you are using the latest version of World App.');
          return;
        }

        // Check if MiniKit is properly initialized
        if (!MiniKit?.commandsAsync?.getPermissions) {
          setError('MiniKit commands are not available. Please update World App to the latest version.');
          return;
        }

        // Use the async version of the command as recommended
        const result = await MiniKit.commandsAsync.getPermissions();
        
        if (result?.finalPayload?.status === 'success') {
          setPermissions(result.finalPayload.permissions || {});
          console.log('Permissions fetched successfully:', result);
        } else {
          setError('Failed to fetch permissions. Please try again.');
        }
      } catch (err) {
        console.error('Error fetching permissions:', err);
        setError('An error occurred while fetching permissions');
      }
    };

    initializeAndFetchPermissions();

    // Cleanup function
    return () => {
      // Add any cleanup if needed
    };
  }, [isInstalled]);

  if (error) {
    return (
      <div className="grid w-full gap-4">
        <p className="text-lg font-semibold text-red-500">Error</p>
        <p>{error}</p>
        {!isInstalled && (
          <a 
            href="https://world.org/download" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-500 underline"
          >
            Download World App
          </a>
        )}
      </div>
    );
  }

  return (
    <div className="grid w-full gap-4">
      <p className="text-lg font-semibold">Permissions</p>
      {Object.keys(permissions).length === 0 ? (
        <p>No permissions found</p>
      ) : (
        Object.entries(permissions).map(([permission, value]) => (
          <ListItem
            key={permission}
            description={`Enabled: ${value}`}
            label={permission}
          />
        ))
      )}
    </div>
  );
};
