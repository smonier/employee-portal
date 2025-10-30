import clsx from "clsx";
import { useEffect, useRef, useState } from "react";
import classes from "./LanguageSwitcher.client.module.css";

export default function LanguageSwitcherClient({
	currentLocaleName,
	localesAndUrls,
	mode,
}: {
	currentLocaleName: string;
	localesAndUrls: {
		localeName: string;
		isCurrent: boolean;
		url: string;
	}[];
	mode: string;
}) {
	const [isOpen, setIsOpen] = useState(false);
	const dropdownRef = useRef<HTMLLIElement | null>(null);
	const suppressHydrationWarning = mode === "edit";

	useEffect(() => {
		if (!isOpen) {
			return;
		}

		const handleClickOutside = (event: MouseEvent) => {
			if (
				dropdownRef.current &&
				!dropdownRef.current.contains(event.target as Node)
			) {
				setIsOpen(false);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);

		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [isOpen]);

	const dropdownHandler = () => {
		setIsOpen((current) => !current);
	};

	return (
		<li className={classes.wrapper} ref={dropdownRef}>
			<button
				className={clsx(classes.trigger, { show: isOpen })}
				type="button"
				aria-expanded={isOpen}
				onClick={dropdownHandler}
				suppressHydrationWarning={suppressHydrationWarning}
			>
				{currentLocaleName}
			</button>
			<ul className={clsx(classes.menu, { show: isOpen })}>
				{localesAndUrls?.map(({ localeName, isCurrent, url }) => (
					<li key={localeName}>
						<a
							className={clsx(classes.item, { active: isCurrent })}
							aria-current={isCurrent}
							href={url}
							suppressHydrationWarning={suppressHydrationWarning}
						>
							{localeName}
						</a>
					</li>
				))}
			</ul>
		</li>
	);
}
