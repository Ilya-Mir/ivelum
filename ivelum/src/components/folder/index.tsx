import React, { useEffect, useState } from 'react';
import { REPO_MAIN_BRANCH, REPOS_FILES } from '../../graphql/queries/repo';
import { useLazyQuery, useQuery } from '@apollo/client';
import { USER_QUERY } from '../../graphql/queries/user';
import { Link, useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFile, faFolder } from '@fortawesome/free-solid-svg-icons';
import { IEntry } from '../../types/entries';
import ReactLoading from 'react-loading';
import ErrorBlock from '../error';

import './folder.scss';
import BackButton from '../back-button';

const Folder: React.FC = () => {
  const { repoName, '*': restOfPath } = useParams();
  const { data: userData, loading: userLoading } = useQuery(USER_QUERY);

  const [defaultBranchName, setDefaultBranchName] = useState('master');
  const [loadBranch, { data: branchData, loading: mainBranchLoading }] =
    useLazyQuery(REPO_MAIN_BRANCH);

  useEffect(() => {
    if (!userLoading) {
      loadBranch({
        variables: { name: repoName, owner: userData?.viewer.login },
      });
    }
  }, [userLoading, loadBranch, repoName, restOfPath]);

  useEffect(() => {
    if (branchData?.repository?.defaultBranchRef?.name) {
      setDefaultBranchName(branchData.repository.defaultBranchRef.name);
    }
  }, [branchData, setDefaultBranchName]);

  const [loadRepos, { called, error, loading: reposLoading, data: reposData }] =
    useLazyQuery(REPOS_FILES, {
      variables: {
        owner: userData?.viewer.login,
        name: repoName,
        expression: `${defaultBranchName}:${
          restOfPath ? restOfPath + '/' : ''
        }`,
      },
    });

  useEffect(() => {
    if (!userLoading && defaultBranchName && !mainBranchLoading) {
      loadRepos();
    }
  }, [userLoading, loadRepos, restOfPath, defaultBranchName]);

  if (userLoading || (called && reposLoading) || mainBranchLoading) {
    return (
      <div className="common__statements-wrapper">
        <ReactLoading type={'bubbles'} color={'#12C413'} />
      </div>
    );
  }

  const entries = reposData?.repository?.object?.entries;

  if (error || !entries)
    return (
      <>
        <BackButton />
        <div className="common__statements-wrapper">
          <ErrorBlock message={error?.message || 'No data'} />
        </div>
      </>
    );

  return (
    <>
      <div className="folder__header">
        <BackButton />
        <div className="folder__title">{restOfPath || repoName}</div>
      </div>
      <div className="folder__container">
        {entries.map((data: IEntry) => {
          const { name, type } = data;
          const isFolder = type === 'tree';

          const path = `${restOfPath ? restOfPath + '/' : ''}${name}`;
          return (
            <Link
              className="folder__file"
              to={`/${repoName}/${isFolder ? 'folder' : 'file'}/${path}`}
              key={name}
            >
              <FontAwesomeIcon icon={isFolder ? faFolder : faFile} />
              <div className="folders__name">{name}</div>
            </Link>
          );
        })}
      </div>
    </>
  );
};

export default Folder;
