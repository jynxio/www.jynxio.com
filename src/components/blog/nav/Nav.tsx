import style from './Nav.module.css';
import Theme from '@/components/blog/theme';
import catalogData from '@/temps/configs/detailCatalog.json';
import * as searchStore from '@/stores/search';
import { useNavigate, useParams } from '@solidjs/router';
import { For, Show, createSelector, createSignal } from 'solid-js';

function Nav() {
	return (
		<nav class={style.container}>
			<Search />
			<hr />
			<Catalog />
			<hr />
			<Control />
		</nav>
	);
}

function Search() {
	return (
		<section class={style.search} onClick={handleClick}>
			<span class={style.icon}>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="24"
					height="24"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
					class="lucide lucide-terminal"
				>
					<polyline points="4 17 10 11 4 5" />
					<line x1="12" x2="20" y1="19" y2="19" />
				</svg>
			</span>
			<span class={style.text}>按 / 搜索</span>
		</section>
	);

	function handleClick() {
		if (searchStore.getEnabled()) return;

		searchStore.setEnabled(true);
	}
}

function Catalog() {
	const params = useParams();
	const navigate = useNavigate();

	const createTopicName = () => params.path.split('/')[0] || '';
	const createPostName = () => params.path.split('/')[1] || '';

	const isTargetTopic = createSelector(createTopicName);
	const isTargetPost = createSelector(createPostName);

	return (
		<section class={style.catalog}>
			<For each={catalogData}>
				{topic => (
					<>
						<div
							class={style.topic}
							classList={{ [style.selected]: isTargetTopic(topic.name) }}
							onClick={[handleTopicClick, [topic.name]]}
						>
							<span class={style.name}>{topic.alias}</span>
							<span class={style.icon}>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="24"
									height="24"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									stroke-width="2"
									stroke-linecap="round"
									stroke-linejoin="round"
									class="lucide lucide-chevron-right"
								>
									<polyline points="9 18 15 12 9 6" />
								</svg>
							</span>
						</div>
						<Show when={isTargetTopic(topic.name)}>
							<For each={topic.children}>
								{post => (
									<div
										class={style.post}
										classList={{ [style.selected]: isTargetPost(post.name) }}
										onClick={[handlePostClick, [topic.name, post.name]]}
									>
										<span class={style.name}>{post.alias}</span>
										<data class={style.data}>{post.time}</data>
									</div>
								)}
							</For>
						</Show>
					</>
				)}
			</For>
		</section>
	);

	function handleTopicClick([topicName]: [string]) {
		navigate(isTargetTopic(topicName) ? '/blog/' : `/blog/${topicName}`);
	}

	function handlePostClick([topicName, postName]: [string, string]) {
		navigate(`/blog/${topicName}/${postName}`);
	}
}

function Control() {
	const navigate = useNavigate();
	const themeKey = 'www.jynxio.com-theme';
	const themeValue = ((): 'light' | 'dark' => {
		const storage = localStorage.getItem(themeKey);

		if (storage === 'dark' || storage === 'light') return storage;

		if (matchMedia('(prefers-color-scheme: dark)').matches) return 'dark';

		return 'light';
	})();

	document.documentElement.classList.add(themeValue);

	const [getTheme, setTheme] = createSignal(themeValue);

	return (
		<section class={style.control}>
			<span class={style.icon}>
				<a
					href="/home" /* 请保留href属性，以便于浏览器在光标悬停时预报目的地址 */
					onClick={event => (event.preventDefault(), navigate('/home'))}
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="24"
						height="24"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
						class="lucide lucide-tent"
					>
						<path d="M3.5 21 14 3" />
						<path d="M20.5 21 10 3" />
						<path d="M15.5 21 12 15l-3.5 6" />
						<path d="M2 21h20" />
					</svg>
					<span class={style.identifier}>homepage</span>
				</a>
			</span>
			<span class={style.icon}>
				<a href="https://github.com/jynxio" target="_blank">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="24"
						height="24"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
						class="lucide lucide-github"
					>
						<path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
						<path d="M9 18c-4.51 2-5-2-7-2" />
					</svg>
					<span class={style.identifier}>github</span>
				</a>
			</span>
			<span class={style.icon}>
				<a href="https://twitter.com/jyn_xio" target="_blank">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="24"
						height="24"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
						class="lucide lucide-twitter"
					>
						<path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
					</svg>
					<span class={style.identifier}>twitter</span>
				</a>
			</span>
			<span class={style.icon}>
				<a href="https://github.com/jynxio/www.jynxio.com/issues/new" target="_blank">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="24"
						height="24"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
						class="lucide lucide-bug"
					>
						<path d="m8 2 1.88 1.88" />
						<path d="M14.12 3.88 16 2" />
						<path d="M9 7.13v-1a3.003 3.003 0 1 1 6 0v1" />
						<path d="M12 20c-3.3 0-6-2.7-6-6v-3a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v3c0 3.3-2.7 6-6 6" />
						<path d="M12 20v-9" />
						<path d="M6.53 9C4.6 8.8 3 7.1 3 5" />
						<path d="M6 13H2" />
						<path d="M3 21c0-2.1 1.7-3.9 3.8-4" />
						<path d="M20.97 5c0 2.1-1.6 3.8-3.5 4" />
						<path d="M22 13h-4" />
						<path d="M17.2 17c2.1.1 3.8 1.9 3.8 4" />
					</svg>
					<span class={style.identifier}>issue</span>
				</a>
			</span>
			<span class={style.icon} onClick={handleClick}>
				<Theme mode={getTheme()} />
			</span>
		</section>
	);

	function handleClick() {
		const themeValue = getTheme() === 'dark' ? 'light' : 'dark';

		themeValue === 'dark'
			? (document.documentElement.classList.add('dark'), document.documentElement.classList.remove('light'))
			: (document.documentElement.classList.remove('dark'), document.documentElement.classList.add('light'));

		setTheme(themeValue);
		localStorage.setItem(themeKey, themeValue);
	}
}

export default Nav;
