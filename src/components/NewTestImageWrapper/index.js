import React from 'react';
import styles from './index.less';

export default ({ src, desc, style }) => (
	<div style={style} className={styles.imageWrapper}>
		<img className={styles.img} src={src} alt={desc} />
		{desc && <div className={styles.desc}>{desc}</div>}
	</div>
);
