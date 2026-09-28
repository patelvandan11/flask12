'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Brain,
  Cpu,
  Database,
  Wrench,
  Sparkles,
  Shield,
  Lock,
  Brush,
  Palette,
  ScanFace,
  Video,
  BarChart3,
  User,
  MessageSquare,
  ArrowRight,
  Plus,
  Trash2,
  Save,
  Check,
  Zap,
  LayoutGrid,
  Move,
  Edit3,
  MousePointer,
  HelpCircle,
  RotateCcw,
  CheckCircle2,
  RefreshCw,
  Maximize2,
  Minimize2,
  LogOut,
  X,
  Expand,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';

export type FlowchartMode = 'simple-pipeline' | 'complex-canvas';

export interface FlowNode {
  id: string;
  x: number;
  y: number;
  label: string;
  subtext: string;
  type: string;
  color: string;
}

export interface FlowEdge {
  id: string;
  from: string;
  to: string;
  label?: string;
}

export interface FlowchartSchema {
  mode: FlowchartMode;
  title: string;
  subtitle: string;
  nodes: FlowNode[];
  edges: FlowEdge[];
}

interface InteractiveCanvasFlowchartProps {
  projectId: string;
  isAdmin?: boolean;
  onRequireAdminLogin?: () => void;
  onLogout?: () => void;
}

const COLOR_MAP: Record<string, { bg: string; border: string; text: string; badge: string; icon: string }> = {
  sky: {
    bg: 'bg-sky-50 dark:bg-sky-950/80',
    border: 'border-sky-300 dark:border-sky-800',
    text: 'text-sky-900 dark:text-sky-100',
    badge: 'bg-sky-100 dark:bg-sky-900 text-sky-800 dark:text-sky-200 border-sky-300',
    icon: 'text-sky-600 dark:text-sky-400',
  },
  emerald: {
    bg: 'bg-emerald-50 dark:bg-emerald-950/80',
    border: 'border-emerald-300 dark:border-emerald-800',
    text: 'text-emerald-900 dark:text-emerald-100',
    badge: 'bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200 border-emerald-300',
    icon: 'text-emerald-600 dark:text-emerald-400',
  },
  purple: {
    bg: 'bg-purple-50 dark:bg-purple-950/80',
    border: 'border-purple-300 dark:border-purple-800',
    text: 'text-purple-900 dark:text-purple-100',
    badge: 'bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 border-purple-300',
    icon: 'text-purple-600 dark:text-purple-400',
  },
  amber: {
    bg: 'bg-amber-50 dark:bg-amber-950/80',
    border: 'border-amber-300 dark:border-amber-800',
    text: 'text-amber-900 dark:text-amber-100',
    badge: 'bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-200 border-amber-300',
    icon: 'text-amber-600 dark:text-amber-400',
  },
  rose: {
    bg: 'bg-rose-50 dark:bg-rose-950/80',
    border: 'border-rose-300 dark:border-rose-800',
    text: 'text-rose-900 dark:text-rose-100',
    badge: 'bg-rose-100 dark:bg-rose-900 text-rose-800 dark:text-rose-200 border-rose-300',
    icon: 'text-rose-600 dark:text-rose-400',
  },
  blue: {
    bg: 'bg-indigo-50 dark:bg-indigo-950/80',
    border: 'border-indigo-300 dark:border-indigo-800',
    text: 'text-indigo-900 dark:text-indigo-100',
    badge: 'bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 border-indigo-300',
    icon: 'text-indigo-600 dark:text-indigo-400',
  },
  mint: {
    bg: 'bg-teal-50 dark:bg-teal-950/80',
    border: 'border-teal-300 dark:border-teal-800',
    text: 'text-teal-900 dark:text-teal-100',
    badge: 'bg-teal-100 dark:bg-teal-900 text-teal-800 dark:text-teal-200 border-teal-300',
    icon: 'text-teal-600 dark:text-teal-400',
  },
  yellow: {
    bg: 'bg-yellow-50 dark:bg-yellow-950/80',
    border: 'border-yellow-300 dark:border-yellow-800',
    text: 'text-yellow-900 dark:text-yellow-100',
    badge: 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 border-yellow-300',
    icon: 'text-yellow-600 dark:text-yellow-400',
  },
};

const DEFAULT_FLOWCHARTS: Record<string, FlowchartSchema> = {
  'ai-civilization-simulator': {
    mode: 'complex-canvas',
    title: 'AI Civilization Multi-Agent Architecture',
    subtitle: 'Interactive Node-Graph Canvas: Perception, LLM Planning, Memory Tree & Governance',
    nodes: [
      { id: 'n1', x: 40, y: 50, label: 'World Biome Engine', subtext: 'Procedural Terrain & Resources', type: 'input', color: 'blue' },
      { id: 'n2', x: 270, y: 50, label: 'Perception Vector', subtext: 'Spatial State Input', type: 'process', color: 'sky' },
      { id: 'n3', x: 500, y: 50, label: 'Agent Brain (RL + LLM)', subtext: 'Decision & Goal Trees', type: 'reasoning', color: 'mint' },
      { id: 'n4', x: 500, y: 220, label: 'Agent Memory Tree', subtext: 'Short & Long-Term Vector DB', type: 'database', color: 'yellow' },
      { id: 'n5', x: 740, y: 50, label: 'Governance & Voting', subtext: 'Consensus & Laws Protocol', type: 'decision', color: 'purple' },
      { id: 'n6', x: 740, y: 220, label: 'Resource Economy Market', subtext: 'Gathering, Trade & Crafting', type: 'tool', color: 'amber' },
      { id: 'n7', x: 970, y: 130, label: 'Evolving Digital Society', subtext: 'Real-Time World State Sync', type: 'output', color: 'emerald' },
    ],
    edges: [
      { id: 'e1', from: 'n1', to: 'n2', label: 'Raw Map Matrix' },
      { id: 'e2', from: 'n2', to: 'n3', label: 'State Vectors' },
      { id: 'e3', from: 'n3', to: 'n4', label: 'Read/Write Memories' },
      { id: 'e4', from: 'n3', to: 'n5', label: 'Propose Policies' },
      { id: 'e5', from: 'n5', to: 'n6', label: 'Execute Rules' },
      { id: 'e6', from: 'n6', to: 'n7', label: 'Update World' },
    ],
  },
  meivan: {
    mode: 'simple-pipeline',
    title: 'Meivan Guard Interceptor Pipeline',
    subtitle: 'Request Parsing, Policy Validation & Sanitized Output',
    nodes: [
      { id: 'm1', x: 40, y: 80, label: 'Client Request', subtext: 'Raw LLM Prompt', type: 'input', color: 'sky' },
      { id: 'm2', x: 260, y: 80, label: 'Meivan Interceptor', subtext: '<5ms FastAPI Parser', type: 'process', color: 'blue' },
      { id: 'm3', x: 480, y: 80, label: 'PII & Injection Shield', subtext: 'Rule Evaluation', type: 'reasoning', color: 'mint' },
      { id: 'm4', x: 700, y: 80, label: 'Upstream LLM Provider', subtext: 'Sanitized Payload', type: 'output', color: 'emerald' },
    ],
    edges: [
      { id: 'me1', from: 'm1', to: 'm2', label: 'HTTPS Payload' },
      { id: 'me2', from: 'm2', to: 'm3', label: 'Check Guardrails' },
      { id: 'me3', from: 'm3', to: 'm4', label: 'Safe Dispatch' },
    ],
  },
  'meivan-art': {
    mode: 'complex-canvas',
    title: 'Generative Canvas Shader Architecture',
    subtitle: 'Interactive Nodes: Touch Gestures, Brush Physics, Color Harmony & WebGL Viewport',
    nodes: [
      { id: 'a1', x: 50, y: 90, label: 'Stylus / Touch Input', subtext: 'Coord & Pressure Vectors', type: 'input', color: 'rose' },
      { id: 'a2', x: 290, y: 60, label: 'Procedural Brush Physics', subtext: 'Fluid Drag & Splatter Math', type: 'process', color: 'mint' },
      { id: 'a3', x: 290, y: 220, label: 'Color Harmony Engine', subtext: 'Algorithmic Gradient Mesh', type: 'database', color: 'yellow' },
      { id: 'a4', x: 550, y: 140, label: 'WebGL Fragment Shader', subtext: 'Real-time Fragment Processing', type: 'reasoning', color: 'purple' },
      { id: 'a5', x: 810, y: 140, label: 'Canvas Render Viewport', subtext: '60 FPS Output Frame', type: 'output', color: 'emerald' },
    ],
    edges: [
      { id: 'ae1', from: 'a1', to: 'a2', label: 'Motion Input' },
      { id: 'ae2', from: 'a2', to: 'a4', label: 'Texture Matrix' },
      { id: 'ae3', from: 'a3', to: 'a4', label: 'Swatches Array' },
      { id: 'ae4', from: 'a4', to: 'a5', label: 'Display Frame' },
    ],
  },
  'deepfake-detection': {
    mode: 'simple-pipeline',
    title: 'MTCNN + GRU Sequential Detection Pipeline',
    subtitle: 'Frame Parsing, Face Bounding Box, 5 Landmarks & Temporal Classification',
    nodes: [
      { id: 'd1', x: 40, y: 80, label: 'RGB Video Stream', subtext: 'DFDC Dataset', type: 'input', color: 'amber' },
      { id: 'd2', x: 260, y: 80, label: 'MTCNN Face Detector', subtext: '5 Facial Keypoints', type: 'process', color: 'mint' },
      { id: 'd3', x: 480, y: 80, label: 'GRU Recurrent Classifier', subtext: '30-Frame Sequence Vector', type: 'reasoning', color: 'purple' },
      { id: 'd4', x: 700, y: 80, label: 'Authenticity Rating Score', subtext: '98.6% Accuracy Output', type: 'output', color: 'emerald' },
    ],
    edges: [
      { id: 'de1', from: 'd1', to: 'd2', label: 'Extract Frames' },
      { id: 'de2', from: 'd2', to: 'd3', label: 'Facial Landmarks' },
      { id: 'de3', from: 'd3', to: 'd4', label: 'Classify Anomaly' },
    ],
  },
};

export default function InteractiveCanvasFlowchart({
  projectId,
  isAdmin = false,
  onRequireAdminLogin,
  onLogout,
}: InteractiveCanvasFlowchartProps) {
  const [data, setData] = useState<FlowchartSchema>(
    DEFAULT_FLOWCHARTS[projectId] || DEFAULT_FLOWCHARTS['ai-civilization-simulator']
  );
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [newEdgeFrom, setNewEdgeFrom] = useState<string>('');
  const [newEdgeTo, setNewEdgeTo] = useState<string>('');
  const [newEdgeLabel, setNewEdgeLabel] = useState<string>('');

  // Mouse Zoom & Pan State
  const canvasViewportRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const [zoomScale, setZoomScale] = useState<number>(1);
  const [panPos, setPanPos] = useState({ x: 0, y: 0 });
  const [isPanningCanvas, setIsPanningCanvas] = useState(false);
  const [panStartPos, setPanStartPos] = useState({ x: 0, y: 0 });

  // Admin Node Dragging State
  const [draggingNodeId, setDraggingNodeId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  // Load from API on mount
  useEffect(() => {
    fetch('/api/flowcharts')
      .then((res) => res.json())
      .then((flowcharts) => {
        if (flowcharts && flowcharts[projectId]) {
          setData(flowcharts[projectId]);
        }
      })
      .catch((err) => console.log('Loaded default flowchart for', projectId));
  }, [projectId]);

  // Non-passive mouse wheel zoom event listener
  useEffect(() => {
    const viewportElem = canvasViewportRef.current;
    if (!viewportElem) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      const zoomFactor = e.deltaY < 0 ? 1.08 : 0.92;
      setZoomScale((prev) => Math.min(2.5, Math.max(0.5, +(prev * zoomFactor).toFixed(2))));
    };

    viewportElem.addEventListener('wheel', handleWheel, { passive: false });
    return () => {
      viewportElem.removeEventListener('wheel', handleWheel);
    };
  }, [data.mode, isFullscreen]);

  // Handle saving flowchart to backend
  const handleSave = async () => {
    setIsSaving(true);
    setSaveSuccess(false);

    try {
      const res = await fetch('/api/flowcharts/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId,
          flowchartData: data,
        }),
      });

      const result = await res.json();
      if (res.ok && result.success) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      } else {
        alert(result.error || 'Failed to save flowchart changes');
      }
    } catch (err) {
      alert('Error connecting to server to save flowchart');
    } finally {
      setIsSaving(false);
    }
  };

  // Handle Logout
  const handleLogout = async () => {
    try {
      await fetch('/api/admin/session', { method: 'POST' });
      if (onLogout) onLogout();
    } catch (err) {
      console.error('Logout error', err);
    }
  };

  // Canvas Pan & Node Drag Mouse Handlers
  const handleMouseDownCanvasBg = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (
      target === canvasViewportRef.current ||
      target === canvasRef.current ||
      target.tagName === 'svg' ||
      target.tagName === 'path'
    ) {
      setIsPanningCanvas(true);
      setPanStartPos({ x: e.clientX - panPos.x, y: e.clientY - panPos.y });
    }
  };

  const handleMouseDownNode = (e: React.MouseEvent, nodeId: string) => {
    if (!isAdmin) return;
    e.stopPropagation();
    setSelectedNodeId(nodeId);
    setDraggingNodeId(nodeId);

    const node = data.nodes.find((n) => n.id === nodeId);
    if (node && canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      const mouseX = (e.clientX - rect.left) / zoomScale;
      const mouseY = (e.clientY - rect.top) / zoomScale;
      setDragOffset({ x: mouseX - node.x, y: mouseY - node.y });
    }
  };

  const handleMouseMoveCanvas = (e: React.MouseEvent) => {
    if (isPanningCanvas) {
      setPanPos({
        x: Math.round(e.clientX - panStartPos.x),
        y: Math.round(e.clientY - panStartPos.y),
      });
      return;
    }

    if (!draggingNodeId || !canvasRef.current || !isAdmin) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const mouseX = (e.clientX - rect.left) / zoomScale;
    const mouseY = (e.clientY - rect.top) / zoomScale;
    const newX = Math.max(10, Math.min(1250, Math.round(mouseX - dragOffset.x)));
    const newY = Math.max(10, Math.min(700, Math.round(mouseY - dragOffset.y)));

    setData((prev) => ({
      ...prev,
      nodes: prev.nodes.map((n) => (n.id === draggingNodeId ? { ...n, x: newX, y: newY } : n)),
    }));
  };

  const handleMouseUpCanvas = () => {
    setDraggingNodeId(null);
    setIsPanningCanvas(false);
  };

  // Node Edit Controls
  const updateSelectedNode = (field: keyof FlowNode, value: string) => {
    if (!selectedNodeId) return;
    setData((prev) => ({
      ...prev,
      nodes: prev.nodes.map((n) => (n.id === selectedNodeId ? { ...n, [field]: value } : n)),
    }));
  };

  const addNode = () => {
    const newId = `node_${Date.now().toString().slice(-4)}`;
    const newNode: FlowNode = {
      id: newId,
      x: 350 + Math.floor(Math.random() * 50),
      y: 120 + Math.floor(Math.random() * 50),
      label: 'New Pipeline Component',
      subtext: 'Configure processing subtext',
      type: 'process',
      color: 'sky',
    };
    setData((prev) => ({ ...prev, nodes: [...prev.nodes, newNode] }));
    setSelectedNodeId(newId);
  };

  const deleteNode = (nodeId: string) => {
    setData((prev) => ({
      ...prev,
      nodes: prev.nodes.filter((n) => n.id !== nodeId),
      edges: prev.edges.filter((e) => e.from !== nodeId && e.to !== nodeId),
    }));
    if (selectedNodeId === nodeId) setSelectedNodeId(null);
  };

  const addEdge = () => {
    if (!newEdgeFrom || !newEdgeTo || newEdgeFrom === newEdgeTo) return;
    const edgeId = `edge_${Date.now().toString().slice(-4)}`;
    const newEdge: FlowEdge = {
      id: edgeId,
      from: newEdgeFrom,
      to: newEdgeTo,
      label: newEdgeLabel || 'Data Vector',
    };
    setData((prev) => ({ ...prev, edges: [...prev.edges, newEdge] }));
    setNewEdgeFrom('');
    setNewEdgeTo('');
    setNewEdgeLabel('');
  };

  const deleteEdge = (edgeId: string) => {
    setData((prev) => ({
      ...prev,
      edges: prev.edges.filter((e) => e.id !== edgeId),
    }));
  };

  const toggleMode = () => {
    setData((prev) => ({
      ...prev,
      mode: prev.mode === 'simple-pipeline' ? 'complex-canvas' : 'simple-pipeline',
    }));
  };

  const selectedNode = data.nodes.find((n) => n.id === selectedNodeId);

  // Fullscreen Container Classes
  const containerClasses = isFullscreen
    ? 'fixed inset-0 z-[3000] w-screen h-screen bg-white/95 dark:bg-[#090d16]/95 backdrop-blur-2xl p-6 md:p-8 flex flex-col justify-between overflow-y-auto animate-in fade-in duration-200 text-slate-900 dark:text-slate-100'
    : 'border-2 border-dashed border-indigo-200 dark:border-indigo-900/60 rounded-3xl p-5 md:p-7 relative bg-slate-50/70 dark:bg-slate-900/40 space-y-6 overflow-hidden';

  return (
    <div className={containerClasses}>
      {/* 1. TOP HEADER & CONTROLS BAR */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[0.65rem] font-bold font-code uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
              {data.mode === 'complex-canvas' ? 'Interactive Node Canvas' : 'Sequential Pipeline'}
            </span>

            {isAdmin ? (
              <span className="text-[0.65rem] font-bold font-code uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 flex items-center gap-1">
                <Lock size={11} /> Admin Mode (Editable)
              </span>
            ) : (
              <button
                type="button"
                onClick={onRequireAdminLogin}
                className="text-[0.65rem] font-bold font-code uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-indigo-600 hover:text-white transition-colors flex items-center gap-1 cursor-pointer"
              >
                <Lock size={11} /> Visitor View (Click for Admin)
              </button>
            )}
          </div>

          <h4 className="text-lg md:text-xl font-extrabold text-slate-900 dark:text-slate-100">
            {data.title}
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-code leading-relaxed">
            {data.subtitle}
          </p>
        </div>

        {/* Action Buttons for Visitor & Admin */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Full Screen Toggle Button */}
          <button
            type="button"
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs font-code flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
          >
            {isFullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
            <span>{isFullscreen ? 'Exit Full Screen' : 'Full Screen Canvas'}</span>
          </button>

          {isAdmin && (
            <>
              <button
                type="button"
                onClick={toggleMode}
                className="px-3 py-1.5 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs font-code flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <LayoutGrid size={14} />
                <span>Switch to {data.mode === 'simple-pipeline' ? 'Canvas' : 'Pipeline'}</span>
              </button>

              <button
                type="button"
                onClick={addNode}
                className="px-3 py-1.5 rounded-xl bg-indigo-100 dark:bg-indigo-950/80 border border-indigo-300 dark:border-indigo-700 text-indigo-700 dark:text-indigo-300 font-bold text-xs font-code flex items-center gap-1.5 hover:bg-indigo-200 transition-colors cursor-pointer"
              >
                <Plus size={14} />
                <span>Add Node</span>
              </button>

              <button
                type="button"
                onClick={handleSave}
                disabled={isSaving}
                className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs font-code flex items-center gap-1.5 shadow-sm transition-all cursor-pointer disabled:opacity-50"
              >
                {isSaving ? (
                  <RefreshCw size={14} className="animate-spin" />
                ) : saveSuccess ? (
                  <Check size={14} />
                ) : (
                  <Save size={14} />
                )}
                <span>{saveSuccess ? 'Saved!' : 'Save Flowchart'}</span>
              </button>

              {/* Admin Logout Button */}
              <button
                type="button"
                onClick={handleLogout}
                className="px-3 py-1.5 rounded-xl bg-rose-600/90 hover:bg-rose-700 text-white font-bold text-xs font-code flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
              >
                <LogOut size={14} />
                <span>Logout Admin</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* 2. MODE A: SIMPLE PIPELINE DISPLAY */}
      {data.mode === 'simple-pipeline' && (
        <div className="space-y-4 my-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {data.nodes.map((node, index) => {
              const colorInfo = COLOR_MAP[node.color] || COLOR_MAP.sky;
              return (
                <div
                  key={node.id}
                  onClick={() => isAdmin && setSelectedNodeId(node.id)}
                  className={`bg-white dark:bg-[#111827] border ${colorInfo.border} rounded-2xl p-4 space-y-3 shadow-sm relative transition-all ${
                    selectedNodeId === node.id ? 'ring-2 ring-indigo-500 scale-[1.02]' : ''
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`text-[0.65rem] font-bold font-code uppercase px-2 py-0.5 rounded ${colorInfo.badge}`}>
                      Step {index + 1}: {node.type}
                    </span>
                    {isAdmin && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteNode(node.id);
                        }}
                        className="text-slate-400 hover:text-red-500 transition-colors p-1"
                      >
                        <Trash2 size={13} />
                      </button>
                    )}
                  </div>

                  <div className={`p-3 rounded-xl ${colorInfo.bg} border ${colorInfo.border} font-bold text-xs ${colorInfo.text} text-center shadow-2xs`}>
                    {node.label}
                  </div>

                  <p className="text-[0.68rem] text-slate-500 dark:text-slate-400 leading-relaxed font-code">
                    {node.subtext}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 3. MODE B: COMPLEX INTERACTIVE CANVAS GRAPH */}
      {data.mode === 'complex-canvas' && (
        <div
          ref={canvasViewportRef}
          onMouseDown={handleMouseDownCanvasBg}
          onMouseMove={handleMouseMoveCanvas}
          onMouseUp={handleMouseUpCanvas}
          onMouseLeave={handleMouseUpCanvas}
          className={`relative w-full overflow-hidden rounded-2xl bg-slate-100/80 dark:bg-[#0b0f19] border border-slate-200 dark:border-slate-800 shadow-inner cursor-grab active:cursor-grabbing ${
            isFullscreen ? 'h-[calc(100vh-280px)] min-h-[500px]' : 'min-h-[380px] md:min-h-[440px]'
          }`}
        >
          {/* Zoom & Pan Scale Container */}
          <div
            ref={canvasRef}
            style={{
              transform: `scale(${zoomScale}) translate(${panPos.x}px, ${panPos.y}px)`,
              transformOrigin: '0 0',
              transition: draggingNodeId || isPanningCanvas ? 'none' : 'transform 0.08s ease-out',
            }}
            className={`relative min-w-[1250px] select-none p-4 ${
              isFullscreen ? 'h-[680px]' : 'h-[440px] md:h-[480px]'
            }`}
          >
            {/* SVG Connecting Edges Vector */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
              <defs>
                <marker
                  id={`arrow-${projectId}`}
                  viewBox="0 0 10 10"
                  refX="8"
                  refY="5"
                  markerWidth="7"
                  markerHeight="7"
                  orient="auto-start-reverse"
                >
                  <path d="M 0 0 L 10 5 L 0 10 z" className="fill-indigo-600 dark:fill-indigo-400" />
                </marker>
              </defs>

              {data.edges.map((edge) => {
                const fromNode = data.nodes.find((n) => n.id === edge.from);
                const toNode = data.nodes.find((n) => n.id === edge.to);

                if (!fromNode || !toNode) return null;

                // Center coordinates of cards (node width ~180px, height ~75px)
                const startX = fromNode.x + 180;
                const startY = fromNode.y + 35;
                const endX = toNode.x;
                const endY = toNode.y + 35;

                // Cubic Bezier curve control points
                const controlX1 = startX + (endX - startX) / 2;
                const controlY1 = startY;
                const controlX2 = startX + (endX - startX) / 2;
                const controlY2 = endY;

                const midX = (startX + endX) / 2;
                const midY = (startY + endY) / 2;

                return (
                  <g key={edge.id}>
                    <path
                      d={`M ${startX} ${startY} C ${controlX1} ${controlY1}, ${controlX2} ${controlY2}, ${endX} ${endY}`}
                      fill="none"
                      strokeWidth="2.5"
                      strokeDasharray="5 3"
                      className="stroke-indigo-500/90 dark:stroke-indigo-400/90"
                      markerEnd={`url(#arrow-${projectId})`}
                    />
                    {edge.label && (
                      <foreignObject x={midX - 55} y={midY - 12} width="110" height="24">
                        <div className="bg-white dark:bg-slate-900 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-[0.62rem] font-code font-extrabold rounded-full px-2 py-0.5 text-center truncate shadow-sm">
                          {edge.label}
                        </div>
                      </foreignObject>
                    )}
                  </g>
                );
              })}
            </svg>

            {/* Nodes DOM Elements */}
            {data.nodes.map((node) => {
              const colorInfo = COLOR_MAP[node.color] || COLOR_MAP.sky;
              const isSelected = selectedNodeId === node.id;

              return (
                <div
                  key={node.id}
                  onMouseDown={(e) => handleMouseDownNode(e, node.id)}
                  onClick={() => setSelectedNodeId(node.id)}
                  style={{ left: `${node.x}px`, top: `${node.y}px` }}
                  className={`absolute z-20 w-[180px] bg-white dark:bg-[#111827] border ${colorInfo.border} rounded-2xl p-3 shadow-md space-y-1.5 transition-shadow cursor-grab active:cursor-grabbing ${
                    isSelected ? 'ring-2 ring-indigo-500 shadow-xl' : ''
                  }`}
                >
                  <div className="flex items-center justify-between font-code text-[0.6rem]">
                    <span className={`px-1.5 py-0.5 rounded font-bold uppercase ${colorInfo.badge}`}>
                      {node.type}
                    </span>
                    {isAdmin && <Move size={12} className="text-slate-400" />}
                  </div>

                  <div className={`p-2 rounded-xl ${colorInfo.bg} font-bold text-xs ${colorInfo.text} leading-tight text-center border ${colorInfo.border}`}>
                    {node.label}
                  </div>

                  <p className="text-[0.62rem] text-slate-500 dark:text-slate-400 font-code truncate text-center">
                    {node.subtext}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Mouse Wheel Zoom & Pan Status Pill */}
          <div className="absolute bottom-3 right-3 z-30 flex items-center gap-2 bg-white/90 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-full px-3 py-1.5 text-[0.65rem] font-code font-bold text-slate-700 dark:text-slate-300 shadow-md backdrop-blur-md">
            <span>🖱️ Mouse Wheel Zoom: {Math.round(zoomScale * 100)}%</span>
            {(zoomScale !== 1 || panPos.x !== 0 || panPos.y !== 0) && (
              <button
                type="button"
                onClick={() => {
                  setZoomScale(1);
                  setPanPos({ x: 0, y: 0 });
                }}
                className="px-2 py-0.5 rounded bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-600 hover:text-white transition-colors cursor-pointer"
              >
                Reset
              </button>
            )}
          </div>
        </div>
      )}

      {/* 4. ADMIN NODE & EDGE EDITOR PANEL */}
      {isAdmin && selectedNode && (
        <div className="p-4 rounded-2xl bg-white dark:bg-[#111827] border border-indigo-200 dark:border-indigo-900/80 shadow-md space-y-4 animate-in fade-in duration-150">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
            <span className="text-xs font-bold font-code text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5">
              <Edit3 size={14} /> Editing Node: <code className="text-slate-900 dark:text-white">{selectedNode.label}</code>
            </span>
            <button
              type="button"
              onClick={() => deleteNode(selectedNode.id)}
              className="text-xs text-red-600 dark:text-red-400 hover:underline font-code flex items-center gap-1"
            >
              <Trash2 size={13} /> Delete Node
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs font-code">
            <div className="space-y-1">
              <label className="text-slate-500 dark:text-slate-400 font-bold block">Label</label>
              <input
                type="text"
                value={selectedNode.label}
                onChange={(e) => updateSelectedNode('label', e.target.value)}
                className="w-full px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100"
              />
            </div>

            <div className="space-y-1">
              <label className="text-slate-500 dark:text-slate-400 font-bold block">Subtext</label>
              <input
                type="text"
                value={selectedNode.subtext}
                onChange={(e) => updateSelectedNode('subtext', e.target.value)}
                className="w-full px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100"
              />
            </div>

            <div className="space-y-1">
              <label className="text-slate-500 dark:text-slate-400 font-bold block">Type (Manual Text or Preset)</label>
              <input
                type="text"
                list={`type-presets-${selectedNode.id}`}
                value={selectedNode.type}
                onChange={(e) => updateSelectedNode('type', e.target.value)}
                placeholder="Type custom node type..."
                className="w-full px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 font-code"
              />
              <datalist id={`type-presets-${selectedNode.id}`}>
                <option value="input">Input / Seed</option>
                <option value="process">Process / Interceptor</option>
                <option value="reasoning">Reasoning / LLM</option>
                <option value="database">Database / Memory</option>
                <option value="decision">Decision / Voting</option>
                <option value="tool">Tool / Action</option>
                <option value="output">Output / Sync</option>
                <option value="AI Agent">AI Agent</option>
                <option value="API Guard">API Guard</option>
                <option value="Custom Module">Custom Module</option>
              </datalist>
            </div>

            <div className="space-y-1">
              <label className="text-slate-500 dark:text-slate-400 font-bold block">Color Theme</label>
              <select
                value={selectedNode.color}
                onChange={(e) => updateSelectedNode('color', e.target.value)}
                className="w-full px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100"
              >
                <option value="sky">Sky Blue</option>
                <option value="emerald">Emerald Green</option>
                <option value="purple">Purple</option>
                <option value="amber">Amber / Gold</option>
                <option value="rose">Rose Red</option>
                <option value="blue">Indigo Blue</option>
                <option value="mint">Mint Teal</option>
                <option value="yellow">Yellow</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* 5. ADMIN ADD EDGE CONNECTIONS DRAWER */}
      {isAdmin && data.mode === 'complex-canvas' && (
        <div className="p-4 rounded-2xl bg-slate-100/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 space-y-3">
          <span className="text-xs font-bold font-code text-slate-700 dark:text-slate-300 block">
            Add Edge Connection Between Nodes
          </span>
          <div className="flex flex-wrap items-center gap-3 text-xs font-code">
            <select
              value={newEdgeFrom}
              onChange={(e) => setNewEdgeFrom(e.target.value)}
              className="px-3 py-1.5 rounded-xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100"
            >
              <option value="">Select Source Node (From)</option>
              {data.nodes.map((n) => (
                <option key={n.id} value={n.id}>
                  {n.label}
                </option>
              ))}
            </select>

            <span className="text-slate-400 font-bold">&rarr;</span>

            <select
              value={newEdgeTo}
              onChange={(e) => setNewEdgeTo(e.target.value)}
              className="px-3 py-1.5 rounded-xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100"
            >
              <option value="">Select Target Node (To)</option>
              {data.nodes.map((n) => (
                <option key={n.id} value={n.id}>
                  {n.label}
                </option>
              ))}
            </select>

            <input
              type="text"
              placeholder="Edge label (e.g. State Vector)"
              value={newEdgeLabel}
              onChange={(e) => setNewEdgeLabel(e.target.value)}
              className="px-3 py-1.5 rounded-xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100"
            />

            <button
              type="button"
              onClick={addEdge}
              disabled={!newEdgeFrom || !newEdgeTo}
              className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold transition-colors disabled:opacity-40 cursor-pointer"
            >
              Connect Nodes
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
