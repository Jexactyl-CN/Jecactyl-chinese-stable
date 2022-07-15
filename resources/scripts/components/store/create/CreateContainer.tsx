import tw from 'twin.macro';
import { breakpoint } from '@/theme';
import * as Icon from 'react-feather';
import { Form, Formik } from 'formik';
import useFlash from '@/plugins/useFlash';
import { useStoreState } from 'easy-peasy';
import { number, object, string } from 'yup';
import { megabytesToHuman } from '@/helpers';
import styled from 'styled-components/macro';
import Field from '@/components/elements/Field';
import Select from '@/components/elements/Select';
import { Egg, getEggs } from '@/api/store/getEggs';
import createServer from '@/api/store/createServer';
import { getNests, Nest } from '@/api/store/getNests';
import { Button } from '@/components/elements/button/index';
import StoreError from '@/components/store/error/StoreError';
import InputSpinner from '@/components/elements/InputSpinner';
import React, { ChangeEvent, useEffect, useState } from 'react';
import TitledGreyBox from '@/components/elements/TitledGreyBox';
import { getResources, Resources } from '@/api/store/getResources';
import PageContentBlock from '@/components/elements/PageContentBlock';

const Container = styled.div`
    ${tw`flex flex-wrap`};

    & > div {
        ${tw`w-full`};

        ${breakpoint('sm')`
      width: calc(50% - 1rem);
    `}

        ${breakpoint('md')`
      ${tw`w-auto flex-1`};
    `}
    }
`;

interface CreateValues {
    name: string;
    description: string | null;
    cpu: number;
    memory: number;
    disk: number;
    ports: number;
    backups: number | null;
    databases: number | null;
}

export default () => {
    const user = useStoreState((state) => state.user.data!);
    const limit = useStoreState((state) => state.storefront.data!.limit);
    const [resources, setResources] = useState<Resources>();
    const { addFlash, clearFlashes, clearAndAddHttpError } = useFlash();
    const [isSubmit, setSubmit] = useState(false);
    const [loading, setLoading] = useState(false);
    const [nests, setNests] = useState<Nest[]>();
    const [nest, setNest] = useState(1);
    const [eggs, setEggs] = useState<Egg[]>();
    const [egg, setEgg] = useState(1);

    useEffect(() => {
        getResources().then((resources) => setResources(resources));
        getNests().then((nests) => setNests(nests));
        getEggs(1).then((eggs) => setEggs(eggs));
    }, []);

    const changeNest = (x: ChangeEvent<HTMLSelectElement>) => {
        setNest(parseInt(x.target.value));
        getEggs(parseInt(x.target.value)).then((eggs) => setEggs(eggs));
    };

    const submit = (values: CreateValues) => {
        setLoading(true);
        clearFlashes('store:create');
        setSubmit(true);

        createServer(values, egg, nest)
            .then(() => {
                setSubmit(false);
                setLoading(false);
                clearFlashes('store:create');
                // @ts-expect-error this is valid
                window.location = '/';
            })
            .then(() =>
                addFlash({
                    type: 'success',
                    key: 'store:create',
                    message: 'Your server has been deployed and is now installing.',
                })
            )
            .catch((error) => {
                setSubmit(false);
                clearAndAddHttpError({ key: 'store:create', error });
            });
    };

    if (!resources || !eggs || !nests) return <StoreError />;
    return (
        <PageContentBlock title={'Create a server'} showFlashKey={'store:create'}>
            <Formik
                onSubmit={submit}
                initialValues={{
                    name: `${user.username}'s server`,
                    description: 'Write a short description here.',
                    cpu: resources.cpu,
                    memory: resources.memory / 1024,
                    disk: resources.disk / 1024,
                    ports: resources.ports,
                    backups: resources.backups,
                    databases: resources.databases,
                    egg: 1,
                }}
                validationSchema={object().shape({
                    name: string().required().min(3),
                    description: string().optional().min(3).max(191),
                    cpu: number().required().min(50).max(resources.cpu).max(limit.cpu),
                    memory: number()
                        .required()
                        .min(1)
                        .max(resources.memory / 1024)
                        .max(limit.memory / 1024),
                    disk: number()
                        .required()
                        .min(1)
                        .max(resources.disk / 1024)
                        .max(limit.disk / 1024),
                    ports: number().required().min(1).max(resources.ports).max(limit.port),
                    backups: number().optional().max(resources.backups).max(limit.backup),
                    databases: number().optional().max(resources.databases).max(limit.database),
                    egg: number().required(),
                })}
            >
                <Form>
                    <h1 className={'j-left text-5xl'}>Basic Details</h1>
                    <h3 className={'j-left text-2xl text-neutral-500'}>Set the basic fields for your new server.</h3>
                    <Container css={tw`lg:grid lg:grid-cols-2 my-10 gap-4`}>
                        <TitledGreyBox title={'Server name'} css={tw`mt-8 sm:mt-0`}>
                            <Field name={'name'} />
                            <p css={tw`mt-1 text-xs`}>Assign a name to your server for use in the Panel.</p>
                            <p css={tw`mt-1 text-xs text-neutral-400`}>
                                Character limits: <code>a-z A-Z 0-9 _ - .</code> and <code>[Space]</code>.
                            </p>
                        </TitledGreyBox>
                        <TitledGreyBox title={'Server description'} css={tw`mt-8 sm:mt-0 `}>
                            <Field name={'description'} />
                            <p css={tw`mt-1 text-xs`}>Set a description for your server.</p>
                            <p css={tw`mt-1 text-xs text-yellow-400`}>* Optional</p>
                        </TitledGreyBox>
                    </Container>
                    <h1 className={'j-left text-5xl'}>Resource Limits</h1>
                    <h3 className={'j-left text-2xl text-neutral-500'}>Set specific limits for CPU, RAM and more.</h3>
                    <Container css={tw`lg:grid lg:grid-cols-3 my-10 gap-4`}>
                        <TitledGreyBox title={'Server CPU limit'} css={tw`mt-8 sm:mt-0`}>
                            <Field name={'cpu'} />
                            <p css={tw`mt-1 text-xs`}>Assign a limit for usable CPU.</p>
                            <p css={tw`mt-1 text-xs text-neutral-400`}>{resources.cpu}% available</p>
                        </TitledGreyBox>
                        <TitledGreyBox title={'Server RAM limit'} css={tw`mt-8 sm:mt-0 `}>
                            <Field name={'memory'} />
                            <p css={tw`mt-1 text-xs`}>Assign a limit for usable RAM.</p>
                            <p css={tw`mt-1 text-xs text-neutral-400`}>
                                {megabytesToHuman(resources.memory)} available
                            </p>
                        </TitledGreyBox>
                        <TitledGreyBox title={'Server Storage limit'} css={tw`mt-8 sm:mt-0 `}>
                            <Field name={'disk'} />
                            <p css={tw`mt-1 text-xs`}>Assign a limit for usable storage.</p>
                            <p css={tw`mt-1 text-xs text-neutral-400`}>{megabytesToHuman(resources.disk)} available</p>
                        </TitledGreyBox>
                    </Container>
                    <h1 className={'j-left text-5xl'}>Feature Limits</h1>
                    <h3 className={'j-left text-2xl text-neutral-500'}>
                        Add databases, allocations and ports to your server.
                    </h3>
                    <Container css={tw`lg:grid lg:grid-cols-3 my-10 gap-4`}>
                        <TitledGreyBox title={'Server allocations'} css={tw`mt-8 sm:mt-0`}>
                            <Field name={'ports'} />
                            <p css={tw`mt-1 text-xs`}>Assign a number of ports to your server.</p>
                            <p css={tw`mt-1 text-xs text-neutral-400`}>{resources.ports} available</p>
                        </TitledGreyBox>
                        <TitledGreyBox title={'Server backups'} css={tw`mt-8 sm:mt-0 `}>
                            <Field name={'backups'} />
                            <p css={tw`mt-1 text-xs`}>Assign a number of backups to your server.</p>
                            <p css={tw`mt-1 text-xs text-neutral-400`}>{resources.backups} available</p>
                        </TitledGreyBox>
                        <TitledGreyBox title={'Server databases'} css={tw`mt-8 sm:mt-0 `}>
                            <Field name={'databases'} />
                            <p css={tw`mt-1 text-xs`}>Assign a number of databases to your server.</p>
                            <p css={tw`mt-1 text-xs text-neutral-400`}>{resources.databases} available</p>
                        </TitledGreyBox>
                    </Container>
                    <h1 className={'j-left text-5xl'}>Server Type</h1>
                    <h3 className={'j-left text-2xl text-neutral-500'}>Choose a server distribution to use.</h3>
                    <Container css={tw`my-10 gap-4`}>
                        <TitledGreyBox title={'Server Nest'} css={tw`mt-8 sm:mt-0`}>
                            <Select name={'nest'} onChange={(n) => changeNest(n)}>
                                {nests.map((n) => (
                                    <option key={n.id} value={n.id}>
                                        {n.name}
                                    </option>
                                ))}
                            </Select>
                            <p css={tw`mt-2 text-sm`}>Select a nest to use for your server.</p>
                        </TitledGreyBox>
                        <TitledGreyBox title={'Server Egg'} css={tw`mt-8 sm:mt-0`}>
                            <Select name={'egg'} onChange={(e) => setEgg(parseInt(e.target.value))}>
                                {eggs.map((e) => (
                                    <option key={e.id} value={e.id}>
                                        {e.name}
                                    </option>
                                ))}
                            </Select>
                            <p css={tw`mt-2 text-sm`}>Choose what game you want to run on your server.</p>
                        </TitledGreyBox>
                    </Container>
                    <InputSpinner visible={loading}>
                        <div css={tw`text-right`}>
                            <Button
                                type={'submit'}
                                className={'w-1/6 mb-4'}
                                size={Button.Sizes.Large}
                                disabled={isSubmit}
                            >
                                Create Your Server! <Icon.ArrowRightCircle className={'ml-2'} />
                            </Button>
                        </div>
                    </InputSpinner>
                </Form>
            </Formik>
        </PageContentBlock>
    );
};
