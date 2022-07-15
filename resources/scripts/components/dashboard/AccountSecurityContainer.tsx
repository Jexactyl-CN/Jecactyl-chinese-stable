import tw from 'twin.macro';
import * as React from 'react';
import { breakpoint } from '@/theme';
import styled from 'styled-components/macro';
import ContentBox from '@/components/elements/ContentBox';
import ActivityLogContainer from './activity/ActivityLogContainer';
import PageContentBlock from '@/components/elements/PageContentBlock';
import UpdatePasswordForm from '@/components/dashboard/forms/UpdatePasswordForm';
import ConfigureTwoFactorForm from '@/components/dashboard/forms/ConfigureTwoFactorForm';

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

export default () => (
    <PageContentBlock title={'账户安全'}>
        <h1 className={'j-left text-5xl'}>账户安全</h1>
        <h3 className={'j-left text-2xl text-neutral-500'}>管理帐户日志和身份验证.</h3>
        <Container css={tw`lg:grid lg:grid-cols-3 my-10`}>
            <div css={tw`flex-none w-full col-span-1`}>
                <ContentBox className={'j-right'} title={'更新密码'} showFlashes={'account:password'}>
                    <UpdatePasswordForm />
                </ContentBox>
                <ContentBox className={'j-right'} title={'动态口令认证设置'} css={tw`mt-8`} showFlashes={'account:2fa'}>
                    <ConfigureTwoFactorForm />
                </ContentBox>
            </div>
            <ContentBox
                className={'j-left'}
                title={'账户日志'}
                css={tw`md:ml-8 mt-8 md:mt-0 col-span-2`}
                showFlashes={'account:logs'}
            >
                <ActivityLogContainer />
            </ContentBox>
        </Container>
    </PageContentBlock>
);
