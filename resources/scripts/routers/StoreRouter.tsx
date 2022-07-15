/*
 * Pterodactyl CHINA - Panel | Jexactyl Branch
 * Simplified Chinese Translation Copyright (c) 2021 - 2022 Ice Ling <iceling@ilwork.cn>
 * Please note the attribution when cite
 * This software is licensed under the terms of the MIT license.
 * https://opensource.org/licenses/MIT
 */

import React from 'react';
import tw from 'twin.macro';
import * as Icon from 'react-feather';
import { useStoreState } from 'easy-peasy';
import { useLocation } from 'react-router';
import TransitionRouter from '@/TransitionRouter';
import SidePanel from '@/components/elements/SidePanel';
import { NotFound } from '@/components/elements/ScreenBlock';
import EarnContainer from '@/components/store/EarnContainer';
import SubNavigation from '@/components/elements/SubNavigation';
import useWindowDimensions from '@/plugins/useWindowDimensions';
import EditContainer from '@/components/store/edit/EditContainer';
import BalanceContainer from '@/components/store/BalanceContainer';
import ReferralContainer from '@/components/store/ReferralContainer';
import OverviewContainer from '@/components/store/OverviewContainer';
import MobileNavigation from '@/components/elements/MobileNavigation';
import CreateContainer from '@/components/store/create/CreateContainer';
import { NavLink, Route, Switch, useRouteMatch } from 'react-router-dom';
import ResourcesContainer from '@/components/store/ResourcesContainer';

const StoreRouter = () => {
    const match = useRouteMatch<{ id: string }>();
    const location = useLocation();
    const { width } = useWindowDimensions();
    const earn = useStoreState((state) => state.storefront.data!.earn);
    const referrals = useStoreState((state) => state.storefront.data!.referrals);

    return (
        <>
            {width >= 1280 ? <SidePanel /> : <MobileNavigation />}
            <SubNavigation className={'j-down'}>
                <div>
                    <NavLink to={`${match.url}`} exact>
                        <div css={tw`flex items-center justify-between`}>
                            概览 <Icon.Home css={tw`ml-1`} size={18} />
                        </div>
                    </NavLink>
                    <NavLink to={`${match.url}/balance`}>
                        <div css={tw`flex items-center justify-between`}>
                            账户余额 <Icon.DollarSign css={tw`ml-1`} size={18} />
                        </div>
                    </NavLink>
                    <NavLink to={`${match.url}/resources`}>
                        <div css={tw`flex items-center justify-between`}>
                            账户资源 <Icon.ShoppingCart css={tw`ml-1`} size={18} />
                        </div>
                    </NavLink>
                    {earn.enabled === 'true' && (
                        <NavLink to={`${match.url}/earn`}>
                            <div css={tw`flex items-center justify-between`}>
                                获取积分 <Icon.DollarSign css={tw`ml-1`} size={18} />
                            </div>
                        </NavLink>
                    )}
                    {referrals.enabled === 'true' && (
                        <NavLink to={`${match.url}/referrals`}>
                            <div css={tw`flex items-center justify-between`}>
                                推广 <Icon.Users css={tw`ml-1`} size={18} />
                            </div>
                        </NavLink>
                    )}
                </div>
            </SubNavigation>
            <TransitionRouter>
                <Switch location={location}>
                    <Route path={`${match.path}`} exact>
                        <OverviewContainer />
                    </Route>
                    <Route path={`${match.path}/balance`} exact>
                        <BalanceContainer />
                    </Route>
                    <Route path={`${match.path}/resources`} exact>
                        <ResourcesContainer />
                    </Route>
                    <Route path={`${match.path}/create`} exact>
                        <CreateContainer />
                    </Route>
                    <Route path={`${match.path}/edit`} exact>
                        <EditContainer />
                    </Route>
                    {earn.enabled === 'true' && (
                        <Route path={`${match.path}/earn`} exact>
                            <EarnContainer />
                        </Route>
                    )}
                    {referrals.enabled === 'true' && (
                        <Route path={`${match.path}/referrals`} exact>
                            <ReferralContainer />
                        </Route>
                    )}
                    <Route path={'*'}>
                        <NotFound />
                    </Route>
                </Switch>
            </TransitionRouter>
        </>
    );
};

export default StoreRouter;
