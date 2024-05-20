import React, {ForwardRefRenderFunction, Ref, useEffect, useImperativeHandle, useRef, useState} from "react";
import classNames from "classnames";
import {Button, Form, Input, Pagination, Table, Upload} from "antd";
import {useForm} from "antd/es/form/Form";
import {PROMPT_ITEM_KEYS, PROMPT_ITEM_LABELS} from "@/constants/prompt.ts";
import useClientRect from "@/hooks/useClientRect.ts";
import {DownloadOutlined, UploadOutlined, RedoOutlined} from "@ant-design/icons";
import useUpload from "@/hooks/useUpload.ts";
import useTableColumns from "@/hooks/useTableColumns.tsx";
import usePromptStore, {setPromptData} from "@/store/prompt.ts";
import {useShallow} from "zustand/react/shallow";
import EditModalInfo from "@/pages/home/components/edit-model-info";
import EditPrompt from "@/pages/home/components/edit-prompt";
import {v4 as uuidv4} from 'uuid';

export interface HomeProps {
	[key: string]: any;
}

interface HomeRef {
	[key: string]: any;
}

const Home: ForwardRefRenderFunction<HomeRef, HomeProps> = (
	props: HomeProps,
	ref: Ref<HomeRef | HTMLDivElement>
) => {

	const [form] = useForm();

	const {} = props;

	const editModelInfoRef = useRef<any>(null);
	const editPromptRef = useRef<any>(null);

	const {
		promptData,
	} = usePromptStore(useShallow((state: any) => state));

	const {height: tableHeight} = useClientRect({id: 'table-wrapper'});
	const tableScroll = {
		y: tableHeight ? tableHeight - 56 : 1000,
		x: 'max-content',
	};
	const {uploadProps, fileContent, onExportFile} = useUpload({
		onBefore: () => false
	});

	// const [tableData, setTableData] = useState([]);
	const [paginationConfig, setPaginationConfig] = useState<any>({
		current: 1,
		pageSize: 20,
		total: 0
	});

	// Customize instance values exposed to parent components
	useImperativeHandle(ref, () => ({}));

	useEffect(() => {
		if (!Array.isArray(fileContent.content)) return;
		const data = fileContent.content.map((v: any) => ({...v, ...v.modelConfig, id: uuidv4()}));
		setPaginationConfig((p: any) => ({...p, total: data.length}));
		setPromptData(data);
	}, [fileContent]);

	const tableOperationsColumn = {
		render: (_: any, record: any) => {
			return (
				<div>
					<Button
						className={classNames(['mr-3'])}
						size={'small'}
						onClick={() => handlePromptEventAspect('edit', record)}
					>编辑</Button>
					<Button
						className={classNames(['mr-3'])}
						size={'small'}
						onClick={() => handlePromptEventAspect('prompt')}
					>提示词</Button>
				</div>
			);
		}
	}
	const {tableColumns} = useTableColumns({tableData: promptData, operations: tableOperationsColumn})

	const paginationOnChange = (current: number, pageSize: number) => {
		setPaginationConfig((prev: any) => ({...prev, current, pageSize}));
	};

	const handlePromptEventAspect = (type: string, kwargs: object = {}, ...args: any[]) => {
		const handles: any = {
			search: handlePromptOnSearch,
			export: handlePromptOnExport,
			reset: handlePromptOnReset,
			edit: handlePromptOnEdit,
			prompt: handlePromptOnPrompt
		};
		args = Object.keys(kwargs).length ? [kwargs, ...args] : args;
		handles[type] && handles?.[type](...args);
	};

	const handlePromptOnSearch = () => {
	};

	const handlePromptOnExport = () => {
		onExportFile(fileContent);
	};

	const handlePromptOnReset = () => {
		setPromptData([]);
	};

	const handlePromptOnEdit = (record: any) => {
		editModelInfoRef && editModelInfoRef?.current && editModelInfoRef.current.showModal(record);
	};

	const handlePromptOnPrompt = (record: any) => {
		editPromptRef && editPromptRef?.current && editPromptRef.current.showModal(record);
	};

	return (
		<React.Fragment>

			<div className={'flex flex-col justify-between h-full'}>
				<div className={'flex flex-row justify-between items-center py-2'}>
					<Form form={form} layout={'inline'}>
						<Form.Item name={PROMPT_ITEM_KEYS.name} label={PROMPT_ITEM_LABELS[PROMPT_ITEM_KEYS.name]}>
							<Input/>
						</Form.Item>
						<Form.Item>
							<Button type={'primary'} ghost>搜索</Button>
						</Form.Item>
					</Form>
					<div className={'flex flex-row'}>
						<Upload {...uploadProps}>
							<Button
								className={'mr-3'} icon={< DownloadOutlined/>}>导入</Button>
						</Upload>
						<Button
							className={'mr-3'}
							icon={<UploadOutlined/>}
							onClick={() => handlePromptEventAspect('export')}
						>导出</Button>
						<Button
							icon={<RedoOutlined/>}
							onClick={() => handlePromptEventAspect('reset')}
						>重置</Button>
					</div>
				</div>
				<div id={'table-wrapper'} className={'flex-1'}>
					<Table
						rowKey={(record: any) => record.key || record.id}
						dataSource={promptData}
						columns={tableColumns}
						pagination={false}
						scroll={tableScroll}
					/>
				</div>
				<div className={'py-2'}>
					<Pagination
						className={'float-right'}
						current={paginationConfig.current}
						pageSize={paginationConfig.pageSize}
						total={paginationConfig.total}
						onChange={paginationOnChange}
						showSizeChanger
						showQuickJumper
					/>
				</div>
			</div>

			<EditModalInfo ref={editModelInfoRef}/>
			<EditPrompt ref={editPromptRef}/>

		</React.Fragment>
	);
};

export default React.forwardRef(Home);
