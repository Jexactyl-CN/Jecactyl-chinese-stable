{{-- Pterodactyl - Panel which Sinicizated by iLwork.CN STUDIO --}}
{{-- Copyright (c) 2015 - 2017 Dane Everitt <dane@daneeveritt.com> --}}
{{-- Simplified Chinese Translation Copyright (c) 2021 - 2022 Ice Ling <iceling@ilwork.cn> --}}

{{-- This software is licensed under the terms of the MIT license. --}}
{{-- https://opensource.org/licenses/MIT --}}

@extends('layouts.admin')
@include('partials/admin.jexactyl.nav', ['activeTab' => 'referrals'])

@section('title')
    推广系统
@endsection

@section('content-header')
    <h1>推广系统<small>允许用户推广新用户以获取积分.</small></h1>
    <ol class="breadcrumb">
        <li><a href="{{ route('admin.index') }}">管理</a></li>
        <li class="active">Jexactyl</li>
    </ol>
@endsection

@section('content')
    @yield('jexactyl::nav')
    <div class="row">
        <div class="col-xs-12">
        <form action="{{ route('admin.jexactyl.referrals') }}" method="POST">
                <div class="box
                    @if($enabled == 'true')
                        box-success
                    @else
                        box-danger
                    @endif
                ">
                    <div class="box-header with-border">
                        <h3 class="box-title">推广 <small>允许用户推广新用户以获取积分.</small></h3>
                    </div>
                    <div class="box-body">
                        <div class="row">
                            <div class="form-group col-md-4">
                                <label class="control-label">推广系统</label>
                                <div>
                                    <select name="enabled" class="form-control">
                                        <option @if ($enabled == 'false') selected @endif value="false">关闭</option>
                                        <option @if ($enabled == 'true') selected @endif value="true">启用</option>
                                    </select>
                                    <p class="text-muted"><small>确定用户是否可以邀请其他人.</small></p>
                                </div>
                            </div>
                            <div class="form-group col-md-4">
                                <label class="control-label">推广奖励</label>
                                <div>
                                    <div class="input-group">
                                        <input type="text" id="reward" name="reward" class="form-control" value="{{ $reward }}" />
                                        <span class="input-group-addon">积分</span>
                                    </div>
                                    <p class="text-muted"><small>当用户推荐新用户且新用户使用其的推广码时给予用户的积分.</small></p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="box-footer">
                    {!! csrf_field() !!}
                    <button type="submit" name="_method" value="PATCH" class="btn btn-sm btn-primary pull-right">保存更改</button>
                </div>
            </form>
        </div>
    </div>
@endsection
