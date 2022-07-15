/*
 * Pterodactyl CHINA - Panel | Jexactyl Branch
 * Simplified Chinese Translation Copyright (c) 2021 - 2022 Ice Ling <iceling@ilwork.cn>
 * Please note the attribution when cite
 * This software is licensed under the terms of the MIT license.
 * https://opensource.org/licenses/MIT
 */

import React from 'react';
import tw from 'twin.macro';
import { ApplicationStore } from '@/state';
import { httpErrorToHuman } from '@/api/http';
import { ServerContext } from '@/state/server';
import { Actions, useStoreActions } from 'easy-peasy';
import { Button } from '@/components/elements/button/index';
import { ServerDatabase } from '@/api/server/databases/getServerDatabases';
import rotateDatabasePassword from '@/api/server/databases/rotateDatabasePassword';

export default ({ databaseId, onUpdate }: { databaseId: string; onUpdate: (database: ServerDatabase) => void }) => {
    const { addFlash, clearFlashes } = useStoreActions((actions: Actions<ApplicationStore>) => actions.flashes);
    const server = ServerContext.useStoreState((state) => state.server.data!);

    if (!databaseId) {
        return null;
    }

    const rotate = () => {
        clearFlashes();

        rotateDatabasePassword(server.uuid, databaseId)
            .then((database) => onUpdate(database))
            .catch((error) => {
                console.error(error);
                addFlash({
                    type: 'error',
                    title: '错误',
                    message: httpErrorToHuman(error),
                    key: 'database-connection-modal',
                });
            });
    };

    return (
        <Button variant={Button.Variants.Secondary} color={'primary'} css={tw`mr-2`} onClick={rotate}>
            重新生成密码
        </Button>
    );
};
