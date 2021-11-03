import React from 'react';
import clsx from 'clsx';
import styles from './HomepageFeatures.module.css';
import Translate, { translate } from '@docusaurus/Translate';

const FeatureList = [
  {
    title: translate({ id: 'features.1.title', message: 'Monolithic API' }),
    Svg: require('../../static/img/undraw_docusaurus_mountain.svg').default,
    description: (
      <Translate id="features.1.description">
        Monopay gives you a single API to communicate with different payment services.
      </Translate>
    ),
  },
  {
    title: translate({ id: 'features.2.title', message: 'Different Drivers' }),
    Svg: require('../../static/img/undraw_docusaurus_tree.svg').default,
    description: (
      <Translate id="features.2.description">
        You'll be able to use multiple payment services and change them on runtime.
      </Translate>
    ),
  },
  {
    title: translate({ id: 'features.3.title', message: 'Full type-safety' }),
    Svg: require('../../static/img/undraw_docusaurus_react.svg').default,
    description: (
      <Translate id="features.3.description">
        You get full type-safety if you use this package with TypeScript.
      </Translate>
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
