import React from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import styles from './HomepageFeatures.module.css';

const FeatureList = [
  {
    title: 'Monolithic API',
    Svg: require('../../static/img/undraw_docusaurus_mountain.svg').default,
    description: (
      <>
        Polypay gives you a single API to communicate with different payment
        services, you can find a list of the services <Link to="/docs/supported-drivers">here.</Link>
      </>
    ),
  },
  {
    title: 'Different Drivers',
    Svg: require('../../static/img/undraw_docusaurus_tree.svg').default,
    description: (
      <>
        You'll be able to use multiple payment services and change them on runtime.
      </>
    ),
  },
  {
    title: 'Full type-safety',
    Svg: require('../../static/img/undraw_docusaurus_react.svg').default,
    description: (
      <>
        You can get full type-safety if you use this package with TypeScript.
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
