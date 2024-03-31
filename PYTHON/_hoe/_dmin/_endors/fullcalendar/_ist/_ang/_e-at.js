// The index file for the spa running on the summary page
const React = require('react');
const ReactDOM = require('react-dom');
const SummaryTableHeader = require('./summaryTableHeader');
const SummaryTableLine = require('./summaryTableLine');
const SummaryHeader = require('./summaryHeader');
const getChildData = require('./getChildData');
const FlattenToggle = require('./flattenToggle');
const FilterToggle = require('./filterToggle');
const FileBreadcrumbs = require('./fileBreadcrumbs');
const { setLocation, decodeLocation } = require('./routing');

const { useState, useMemo, useEffect } = React;

const sourceData = window.data;
const metricsToShow = {};
for (let i = 0; i < window.metricsToShow.length; i++) {
    metricsToShow[window.metricsToShow[i]] = true;
}

let firstMount = true;

function App() {
    const routingDefaults = decodeLocation();

    const [activeSort, setSort] = useState(
        (routingDefaults && routingDefaults.activeSort) || {
            sortKey: 'file',
            order: 'desc'
        }
    );
    const [isFlat, setIsFlat] = useState(
        (routingDefaults && routingDefaults.isFlat) || false
    );
    const [activeFilters, setFilters] = useState(
        (routingDefaults && routingDefaults.activeFilters) || {
            low: true,
            medium: true,
            high: true
        }
    );
    const [expandedLines, setExpandedLines] = useState(
        (routingDefaults && routingDefaults.expandedLines) || []
    );
    const [fileFilter, setFileFilter] = useState(
        (routingDefaults && routingDefaults.fileFilter) || ''
    );
    const childData = useMemo(
        () =>
            getChildData(
                sourceData,
                metricsToShow,
                activeSort,
                isFlat,
                activeFilters,
                fileFilter
            ),
        [activeSort, isFlat, activeFilters, fileFilter]
    );
    const overallMetrics = sourceData.metrics;

    useEffect(() => {
        setLocation(
            firstMount,
            activeSort,
            isFlat,
            activeFilters,
            fileFilter,
            expandedLines
        );
        firstMount = false;
    }, [activeSort, isFlat, activeFilters, fileFilter, expandedLines]);

    useEffect(() => {
        win