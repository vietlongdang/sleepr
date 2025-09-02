import { UnauthorizedException } from '@nestjs/common';
import { app } from './app';
import { ClientProxy } from '@nestjs/microservices';
import { AUTH_SERVICE } from '@app/common';
import { lastValueFrom } from 'rxjs';

export const authContext = async ({ req }) => {
    try {
        console.log('Auth context called with headers:', req?.headers);

        if (!req || !req.headers) {
            console.log('No request or headers found');
            return { user: null };
        }

        if (!app) {
            console.error('App instance not available');
            return { user: null };
        }

        const authClient = app.get<ClientProxy>(AUTH_SERVICE);

        // Get authentication token
        const authentication =
            req.headers.authentication ||
            req.headers.Authorization ||
            req.headers.authorization ||
            req.cookies?.Authentication;

        console.log('Authentication token:', authentication ? 'Found' : 'Not found');

        if (!authentication) {
            return { user: null };
        }

        console.log('Sending authentication request...');

        const user = await lastValueFrom(
            authClient.send('authenticate', {
                Authentication: authentication,
            }),
        );

        console.log('Authentication successful:', user ? 'Yes' : 'No');
        return { user };

    } catch (err) {
        console.error('Authentication error:', err.message);
        return { user: null }; // Don't throw, just return null user
    }
};