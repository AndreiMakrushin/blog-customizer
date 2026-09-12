import { ArrowButton } from 'src/ui/arrow-button';
import { Button } from 'src/ui/button';
import clsx from 'clsx';
import styles from './ArticleParamsForm.module.scss';
import { useState, useEffect, useRef } from 'react';
import { Select } from 'src/ui/select';
import { RadioGroup } from 'src/ui/radio-group';
import { Separator } from 'src/ui/separator';
import { Text } from 'src/ui/text';
import type { ArticleStateType, OptionType } from 'src/constants/articleProps';
import {
	fontSizeOptions,
	fontFamilyOptions,
	fontColors,
	backgroundColors,
	contentWidthArr,
} from 'src/constants/articleProps';
import { useDisclosure } from 'src/hooks/useDisclosure';

export type SetAppStateType = {
	setAppState: (value: ArticleStateType) => void;
	defaultArticleState: ArticleStateType;
};

export const ArticleParamsForm = ({
	setAppState,
	defaultArticleState,
}: SetAppStateType) => {
	const { isOpen: isSidebarOpen, toggle, close } = useDisclosure();
	const [formState, setFormState] =
		useState<ArticleStateType>(defaultArticleState);
	const arrowButtonRef = useRef<HTMLDivElement>(null);
	const sideBarRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (!isSidebarOpen) return;

		const handleOutsideClick = (event: MouseEvent) => {
			if (
				sideBarRef.current &&
				!sideBarRef.current.contains(event.target as Node) &&
				!arrowButtonRef.current?.contains(event.target as Node)
			) {
				close();
			}
		};

		window.addEventListener('mousedown', handleOutsideClick);
		return () => window.removeEventListener('mousedown', handleOutsideClick);
	}, [isSidebarOpen, close]);

	const handleChange =
		(fieldName: keyof ArticleStateType) => (value: OptionType) =>
			setFormState((prev) => ({ ...prev, [fieldName]: value }));

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setAppState(formState);
	};

	const handleReset = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setFormState(defaultArticleState);
		setAppState(defaultArticleState);
	};

	const fields = [
		{
			type: 'select',
			name: 'fontFamilyOption',
			title: 'шрифт',
			options: fontFamilyOptions,
			placeholder: 'Выберите шрифт',
		},
		{
			type: 'radio',
			name: 'fontSizeOption',
			title: 'Размер шрифта',
			options: fontSizeOptions,
		},
		{
			type: 'select',
			name: 'fontColor',
			title: 'Цвет шрифта',
			options: fontColors,
			placeholder: 'Выберите цвет',
		},
		{ type: 'separator' },
		{
			type: 'select',
			name: 'backgroundColor',
			title: 'Цвет фона',
			options: backgroundColors,
			placeholder: 'Выберите цвет',
		},
		{
			type: 'select',
			name: 'contentWidth',
			title: 'Ширина контента',
			options: contentWidthArr,
			placeholder: 'Выберите ширину',
		},
	] as const;

	return (
		<>
			<div ref={arrowButtonRef}>
				<ArrowButton isOpen={isSidebarOpen} onClick={toggle} />
			</div>
			<aside
				ref={sideBarRef}
				className={clsx(styles.container, {
					[styles.container_open]: isSidebarOpen,
				})}>
				<form
					className={styles.form}
					onSubmit={handleSubmit}
					onReset={handleReset}>
					<div className={styles.topContainer}>
						<Text weight={800} size={31} uppercase>
							Задайте параметры
						</Text>
						{fields.map((field, index) => {
							if (field.type === 'separator') return <Separator key={index} />;
							if (field.type === 'select') {
								return (
									<Select
										key={field.name}
										title={field.title}
										options={field.options}
										selected={formState[field.name]}
										placeholder={field.placeholder}
										onChange={handleChange(field.name)}
									/>
								);
							}
							if (field.type === 'radio') {
								return (
									<RadioGroup
										key={field.name}
										title={field.title}
										name={field.name}
										options={field.options}
										selected={formState[field.name]}
										onChange={handleChange(field.name)}
									/>
								);
							}
						})}
					</div>
					<div className={styles.bottomContainer}>
						<Button title='Сбросить' htmlType='reset' type='clear' />
						<Button title='Применить' htmlType='submit' type='apply' />
					</div>
				</form>
			</aside>
		</>
	);
};
