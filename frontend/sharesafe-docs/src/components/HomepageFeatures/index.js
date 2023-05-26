import React from "react";
import clsx from "clsx";
import styles from "./styles.module.css";

const FeatureList = [
  {
    title: "Secure authentication",
    Svg: require("@site/static/img/lock.svg").default,
    description: (
      <>
        SHARESAFE uses a secure authentication system to ensure that only the
        intended recipient can access the data.
      </>
    ),
  },
  {
    title: "Share more, worry less",
    Svg: require("@site/static/img/net.svg").default,
    description: (
      <>
        SHARESAFE lemma is to share more, worry less. We want to make sure that
        you can share your files with your friends and family without worrying
        about the security of your data.
      </>
    ),
  },
  {
    title: "Choice of Algorithms",
    Svg: require("@site/static/img/algorithms.svg").default,
    description: (
      <>
        SHARESAFE was designed with security in mind. You can choose the
        algorithm method that best suits your needs.
      </>
    ),
  },
];

function Feature({ Svg, title, description }) {
  return (
    <div className={clsx("col col--4")}>
      <div className="text--center">
        <Svg className={styles.featureSvg} role="img" />
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
