import React, { useEffect, useState } from 'react';
import { REPO_FILE, REPO_MAIN_BRANCH } from '../../graphql/queries/repo';
import { useLazyQuery, useQuery } from '@apollo/client';
import { USER_QUERY } from '../../graphql/queries/user';
import { useParams } from 'react-router-dom';
import ReactLoading from 'react-loading';
import { Highlight, themes } from 'prism-react-renderer';
import ErrorBlock from '../error';
import BackButton from '../back-button';
import './file.scss';

const File: React.FC = () => {
  const { data: userData, loading: userLoading } = useQuery(USER_QUERY);
  const { repoName, '*': filePath } = useParams();
  const [defaultBranchName, setDefaultBranchName] = useState('master');
  const [loadBranch, { data: branchData, loading: mainBranchLoading }] =
    useLazyQuery(REPO_MAIN_BRANCH);

  const [loadFile, { called, error, loading: fileLoading, data: fileData }] =
    useLazyQuery(REPO_FILE);

  useEffect(() => {
    if (!userLoading) {
      loadBranch({
        variables: { name: repoName, owner: userData?.viewer.login },
      });
    }
  }, [userLoading, loadBranch, repoName, userData]);

  useEffect(() => {
    if (branchData?.repository?.defaultBranchRef?.name) {
      setDefaultBranchName(branchData.repository.defaultBranchRef.name);
    }
  }, [branchData, setDefaultBranchName]);

  useEffect(() => {
    if (!userLoading && userData?.viewer.login && repoName && filePath) {
      loadFile({
        variables: {
          owner: userData.viewer.login,
          name: repoName,
          expression: `${defaultBranchName}:${filePath}`,
        },
      });
    }
  }, [userLoading, loadFile, userData, repoName, filePath, defaultBranchName]);

  if (userLoading || (called && fileLoading) || mainBranchLoading) {
    return (
      <div className="common__statements-wrapper">
        <ReactLoading type={'bubbles'} color={'#12C413'} />
      </div>
    );
  }

  const fileText = fileData?.repository?.object?.text;

  if (error || !fileText)
    return (
      <>
        <BackButton />
        <div className="common__statements-wrapper">
          <ErrorBlock message={error?.message || 'No data'} />
        </div>
      </>
    );
  /* eslint-disable @typescript-eslint/no-explicit-any */
  return (
    <>
      <div className="filer__header">
        <BackButton />
        <div className="file__title">{filePath}</div>
      </div>
      <div className="file__container">
        <Highlight
          code={fileText}
          language="javascript"
          theme={themes.synthwave84}
        >
          {({ className, style, tokens, getLineProps, getTokenProps }: any) => (
            <pre className={className} style={style}>
              {tokens.map((line: any, i: any) => (
                <div key={i} {...getLineProps({ line, key: i })}>
                  {line.map((token: any, key: any) => (
                    <span key={key} {...getTokenProps({ token, key })} />
                  ))}
                </div>
              ))}
            </pre>
          )}
        </Highlight>
      </div>
    </>
  );
  /* eslint-enable @typescript-eslint/no-explicit-any */
};

export default File;
