import React from 'react';
import clsx from 'clsx';
import styles from './HomepageFeatures.module.css';

const FeatureList = [
  {
    title: 'Monolithic API',
    Svg: require('../../static/img/undraw_docusaurus_mountain.svg').default,
    description: (
      <>
        Polypay gives you a single API to communicate with different payment
        services, you can find a list of the services <a href="http://localhost:3000/docs/supported-drivers">here.</a>
      </>
    ),
  },
  {
    title: 'Easy to use',
    Svg: require('../../static/img/undraw_docusaurus_tree.svg').default,
    description: (
      <>
        The package is really easy to use. all you literally have to do is to
        call two simple functions.
      </>
    ),
  },
  {
    title: 'Awesome type-safety',
    Svg: require('../../static/img/undraw_docusaurus_react.svg').default,
    description: (
      <>
        Nothing can go wrong if you're using TypeScript with this package.
        and even if you don't use TypeScript, you still get a nice auto-completion.
      </>
    ),
  },
];

function Feature({ Svg, title, description }) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        {/* <Svg className={styles.featureSvg} alt={title} /> */}
      </div>
      <div className="text--center padding-horiz--md">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures() {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
